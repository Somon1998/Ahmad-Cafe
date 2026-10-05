-- ============================================================================
-- ЭТАП 3: Заказы и настройки (checkout) + SECURITY HARDENING
-- ----------------------------------------------------------------------------
-- Что делает эта миграция:
--   1. app_settings              — конфиг сайта (delivery_price = 10)
--                                   + строгая валидация delivery_price.
--   2. orders                    — заказы клиентов (финансовые поля immutable).
--   3. order_items               — позиции заказа (снапшоты + явные суммы
--                                   base_total / addons_total / line_total).
--   4. order_item_addons         — добавки к позиции (снапшоты, per-unit).
--   5. order_number_seq + функции — безопасная генерация номера заказа
--                                    формата AHMAD-YYYYMMDD-0001 (только БД).
--   6. update_order_status()     — единственный способ для админа менять статус.
--   7. RLS + REVOKE/GRANT: публичный SELECT заказов ЗАПРЕЩЁН, история заказов
--      immutable, заказы создаёт только server-side flow (service_role).
--
-- SECURITY-МОДЕЛЬ (кратко):
--   - Номер заказа генерирует ТОЛЬКО БД (триггер перезаписывает любое значение
--     клиента). next_order_number() нельзя вызвать через RPC (execute revoked).
--   - Финансовые поля заказа (order_number, customer_*, subtotal, delivery_price,
--     total, created_at) неизменяемы после создания (guard-триггер).
--   - Админ через обычный authenticated-клиент НЕ может делать UPDATE/DELETE/
--     INSERT напрямую по orders/order_items/order_item_addons. Статус меняется
--     только через SECURITY DEFINER RPC update_order_status().
--   - Позиции заказа read-only для админа; создаёт их только server-side flow.
--
-- ЧТО ЭТА МИГРАЦИЯ НЕ ДЕЛАЕТ:
--   - НЕ трогает products / product_variants / addons / product_addons
--     (использует их только через внешние ключи).
--   - НЕ вставляет товары. Единственная вставка — конфиг delivery_price=10
--     (идемпотентно, on conflict do nothing).
--   - НЕ выполняет destructive-действий.
--
-- Миграция идемпотентна: повторный запуск безопасен.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) app_settings — глобальные настройки (key/value) + валидация
-- ----------------------------------------------------------------------------
-- Почему value = JSONB, а не numeric/text:
--   - В одной таблице удобно хранить РАЗНОРОДНЫЕ настройки: число
--     (delivery_price), строку, флаг, а в будущем — объект (например часы
--     работы) без изменения схемы таблицы.
--   - JSONB типизирован (число хранится как число) и индексируется.
--   - delivery_price хранится как JSON-число: '10'::jsonb.
--   Чтение на сервере: (value #>> '{}')::numeric.
--
-- HARDENING (пункт 7): чтобы случайно НЕ записать строку/объект вместо числа,
-- добавляем CHECK-констрейнт. Для key = 'delivery_price' значение обязано быть
-- JSON-числом >= 0. Констрейнт срабатывает для ЛЮБОЙ роли (в т.ч. service_role),
-- то есть это DB-level гарантия, а не только UI-валидация.
create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Идемпотентно добавляем валидацию delivery_price (ADD CONSTRAINT IF NOT EXISTS
-- в Postgres напрямую нет, поэтому через DO-блок).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'app_settings_delivery_price_valid'
  ) then
    alter table app_settings
      add constraint app_settings_delivery_price_valid
      check (
        key <> 'delivery_price'
        or (
          jsonb_typeof(value) = 'number'
          and (value #>> '{}')::numeric >= 0
        )
      );
  end if;
end $$;

drop trigger if exists app_settings_updated_at on app_settings;
create trigger app_settings_updated_at
  before update on app_settings
  for each row
  execute function update_updated_at_column();

-- Значение по умолчанию: доставка 10 сомони. Не перезаписываем, если уже задано.
insert into app_settings (key, value)
values ('delivery_price', '10'::jsonb)
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- 2) Генерация номера заказа: AHMAD-YYYYMMDD-0001 (только БД)
-- ----------------------------------------------------------------------------
-- Счётчик по дням (сброс каждый день). Строка счётчика блокируется при upsert,
-- поэтому параллельные заказы получают РАЗНЫЕ номера без коллизий.
create table if not exists order_number_seq (
  day date primary key,
  last_value integer not null default 0
);

-- RLS на счётчике включаем без публичных политик: писать в него будет только
-- функция next_order_number (SECURITY DEFINER) от имени владельца.
alter table order_number_seq enable row level security;

-- HARDENING (пункт 6/защита): прямой доступ к счётчику клиентам не нужен.
revoke all on order_number_seq from anon;
revoke all on order_number_seq from authenticated;

-- Атомарно инкрементирует счётчик за текущий день (по времени Душанбе)
-- и возвращает форматированный номер.
--
-- HARDENING:
--   - security definer  → пишет в счётчик от имени владельца функции,
--     независимо от вызывающей роли (нужно, т.к. authenticated лишён прав
--     на order_number_seq).
--   - set search_path = '' → защита от search_path hijacking: все объекты
--     обращаемся schema-qualified (public.order_number_seq). Функции из
--     pg_catalog (now/to_char/lpad) доступны всегда (pg_catalog неявно в пути).
create or replace function public.next_order_number()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day date := (now() at time zone 'Asia/Dushanbe')::date;
  v_seq integer;
begin
  insert into public.order_number_seq as s (day, last_value)
    values (v_day, 1)
  on conflict (day)
  do update set last_value = s.last_value + 1
  returning s.last_value into v_seq;

  return 'AHMAD-' || to_char(v_day, 'YYYYMMDD') || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

-- HARDENING (пункт 1): запрещаем ПРЯМОЙ вызов next_order_number() через
-- Supabase RPC любым публичным ролям. Обычный пользователь не сможет
-- искусственно расходовать номера заказов. Триггер продолжит работать, т.к.
-- вызывает функцию из-под set_order_number() (SECURITY DEFINER, владелец сохраняет
-- право execute — revoke ниже не затрагивает владельца).
revoke all on function public.next_order_number() from public;
revoke all on function public.next_order_number() from anon;
revoke all on function public.next_order_number() from authenticated;
revoke all on function public.next_order_number() from service_role;

-- Триггерная функция: ВСЕГДА проставляет order_number сама, игнорируя любое
-- значение, переданное клиентом/сервером (пункт 3). Клиент не может создать
-- order_number = 'FAKE-1' — оно будет перезаписано.
--
-- HARDENING:
--   - security definer → внутри вызывается public.next_order_number(); текущий
--     пользователь в теле = владелец функции, у которого есть право execute.
--     Поэтому revoke выше НЕ ломает генерацию номера.
--   - set search_path = '' → защита от hijacking.
create or replace function public.set_order_number()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Номер заказа генерирует ТОЛЬКО БД. Значение клиента полностью игнорируется.
  new.order_number := public.next_order_number();
  return new;
end;
$$;

-- Триггерную функцию тоже прячем от прямого RPC (вызвать её напрямую нельзя —
-- returns trigger, но убираем лишние привилегии для чистоты).
revoke all on function public.set_order_number() from public;
revoke all on function public.set_order_number() from anon;
revoke all on function public.set_order_number() from authenticated;
revoke all on function public.set_order_number() from service_role;

-- ----------------------------------------------------------------------------
-- 3) orders — заказы
-- ----------------------------------------------------------------------------
-- order_number: NOT NULL + UNIQUE. NOT NULL проверяется ПОСЛЕ before-триггера,
-- который гарантированно проставит значение, поэтому конфликта нет (пункт 3).
--
-- Инварианты сумм (пункт 8), гарантируются на уровне строки:
--   - subtotal >= 0
--   - delivery_price >= 0
--   - total >= 0
--   - total >= subtotal
--   - total = subtotal + delivery_price   (numeric — точная арифметика)
-- Row-level CHECK — самое надёжное место для этих инвариантов: они всегда
-- выполняются, даже при ошибке в server-side коде или у service_role.
-- (Инвариант subtotal = SUM(order_items.line_total) — межтабличный, его CHECK
--  выразить не может, он гарантируется атомарным create_order RPC на Этапе 5.)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null
    check (char_length(customer_name) between 1 and 120),
  customer_phone text not null
    check (char_length(customer_phone) between 3 and 32),
  customer_address text not null
    check (char_length(customer_address) between 3 and 300),
  comment text
    check (comment is null or char_length(comment) <= 1000),
  subtotal numeric not null check (subtotal >= 0),
  delivery_price numeric not null default 0 check (delivery_price >= 0),
  total numeric not null check (total >= 0),
  status text not null default 'new' check (
    status in (
      'new', 'confirmed', 'preparing', 'ready',
      'delivering', 'completed', 'cancelled'
    )
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint orders_total_gte_subtotal check (total >= subtotal),
  constraint orders_total_equals_sum check (total = subtotal + delivery_price)
);

drop trigger if exists orders_set_order_number on orders;
create trigger orders_set_order_number
  before insert on orders
  for each row
  execute function public.set_order_number();

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

-- HARDENING (пункт 4): после создания заказа финансовые данные immutable.
-- Guard-триггер запрещает менять любую защищённую колонку при UPDATE.
-- Разрешено менять только status (и updated_at ставит отдельный триггер).
-- Работает для ВСЕХ ролей (authenticated через RPC и service_role), т.к.
-- это DB-level инвариант, а не UI-ограничение.
create or replace function public.orders_prevent_immutable_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.order_number     is distinct from old.order_number
     or new.customer_name    is distinct from old.customer_name
     or new.customer_phone   is distinct from old.customer_phone
     or new.customer_address is distinct from old.customer_address
     or new.subtotal         is distinct from old.subtotal
     or new.delivery_price   is distinct from old.delivery_price
     or new.total            is distinct from old.total
     or new.created_at       is distinct from old.created_at
  then
    raise exception
      'Order financial/customer data is immutable; only status can change'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_prevent_immutable_update on orders;
create trigger orders_prevent_immutable_update
  before update on orders
  for each row
  execute function public.orders_prevent_immutable_update();

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);

-- ----------------------------------------------------------------------------
-- 4) order_items — позиции заказа (снапшоты + однозначные суммы)
-- ----------------------------------------------------------------------------
-- Снапшоты (product_name_snapshot, variant_name_snapshot, unit_price_snapshot)
-- фиксируют название и цену НА МОМЕНТ заказа.
-- FK на products/variants = on delete set null: удаление товара НЕ удаляет
-- историю заказа, только обнуляет ссылку.
--
-- HARDENING (пункт 9): вместо неоднозначного line_subtotal — явная модель:
--   unit_price_snapshot     — цена одной единицы (из variant.price);
--   addons_total_per_unit   — сумма добавок в расчёте на ОДНУ единицу позиции;
--   base_total              = unit_price_snapshot   * quantity;
--   addons_total            = addons_total_per_unit * quantity;
--   line_total              = base_total + addons_total
--                           = (unit_price_snapshot + addons_total_per_unit) * quantity.
-- Все три равенства закреплены CHECK-констрейнтами (numeric — точная арифметика).
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name_snapshot text not null,
  variant_name_snapshot text not null,
  unit_price_snapshot numeric not null check (unit_price_snapshot >= 0),
  quantity integer not null check (quantity >= 1 and quantity <= 100),
  addons_total_per_unit numeric not null default 0 check (addons_total_per_unit >= 0),
  base_total numeric not null check (base_total >= 0),
  addons_total numeric not null default 0 check (addons_total >= 0),
  line_total numeric not null check (line_total >= 0),
  created_at timestamptz default now(),
  constraint order_items_base_total_valid
    check (base_total = unit_price_snapshot * quantity),
  constraint order_items_addons_total_valid
    check (addons_total = addons_total_per_unit * quantity),
  constraint order_items_line_total_valid
    check (line_total = base_total + addons_total)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ----------------------------------------------------------------------------
-- 5) order_item_addons — добавки к позиции (снапшоты, per-unit)
-- ----------------------------------------------------------------------------
-- Семантика однозначна (пункт 9):
--   quantity   — сколько таких добавок на ОДНУ единицу позиции (обычно 1);
--   line_total = addon_price_snapshot * quantity — стоимость этой добавки
--                в расчёте на одну единицу позиции.
-- Тогда order_items.addons_total_per_unit = SUM(order_item_addons.line_total)
-- по данной позиции (гарантируется create_order RPC на Этапе 5).
create table if not exists order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  addon_id uuid references addons(id) on delete set null,
  addon_name_snapshot text not null,
  addon_price_snapshot numeric not null check (addon_price_snapshot >= 0),
  quantity integer not null default 1 check (quantity >= 1 and quantity <= 100),
  line_total numeric not null check (line_total >= 0),
  created_at timestamptz default now(),
  constraint order_item_addons_line_total_valid
    check (line_total = addon_price_snapshot * quantity)
);

create index if not exists order_item_addons_order_item_id_idx
  on order_item_addons (order_item_id);

-- ----------------------------------------------------------------------------
-- 6) update_order_status() — единственный способ менять статус заказа
-- ----------------------------------------------------------------------------
-- HARDENING (пункт 4): вместо широкой UPDATE-политики даём админу узкую точку
-- входа. RPC:
--   - security definer → обходит RLS (владелец функции), поэтому широкая
--     UPDATE-политика на orders НЕ нужна и НЕ создаётся;
--   - сам проверяет public.is_admin() (не полагаемся на UI);
--   - валидирует новый статус по белому списку;
--   - меняет ТОЛЬКО status (updated_at ставит триггер, остальные поля
--     дополнительно защищены guard-триггером orders_prevent_immutable_update);
--   - set search_path = '' → защита от hijacking.
create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if p_new_status not in (
    'new', 'confirmed', 'preparing', 'ready',
    'delivering', 'completed', 'cancelled'
  ) then
    raise exception 'Invalid status: %', p_new_status using errcode = '22023';
  end if;

  update public.orders
     set status = p_new_status
   where id = p_order_id
  returning * into v_order;

  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  return v_order;
end;
$$;

-- Вызывать RPC может только авторизованный клиент (проверка админа — внутри).
revoke all on function public.update_order_status(uuid, text) from public;
revoke all on function public.update_order_status(uuid, text) from anon;
grant execute on function public.update_order_status(uuid, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 7) RLS + привилегии
-- ----------------------------------------------------------------------------
-- Общая модель:
--   - Публичного SELECT по заказам НЕТ (клиент не читает чужие заказы).
--   - Заказы/позиции создаёт только server-side flow через service_role,
--     который ОБХОДИТ RLS (INSERT-политик для anon/authenticated НЕ создаём).
--   - Админ (authenticated + is_admin) только ЧИТАЕТ заказы и позиции.
--   - Статус меняется только через update_order_status() (SECURITY DEFINER).
--   - DELETE запрещён всем публичным ролям (историю сохраняем; отмена =
--     status = 'cancelled').

-- orders ---------------------------------------------------------------------
alter table orders enable row level security;
drop policy if exists "Admin can read orders" on orders;
-- Широкую update-политику НЕ создаём (пункт 4). Оставшиеся с прошлых версий — удаляем.
drop policy if exists "Admin can update orders" on orders;
drop policy if exists "Admin can insert orders" on orders;
drop policy if exists "Admin can delete orders" on orders;

create policy "Admin can read orders"
  on orders for select
  to authenticated
  using (public.is_admin());

-- HARDENING (пункты 4 и 6): убираем прямые права на запись у клиентских ролей.
-- INSERT — только service_role (server-side flow). UPDATE — только через RPC.
-- DELETE — запрещён (историю не удаляем). SELECT оставляем (гейтит RLS-политика).
revoke insert, update, delete on orders from anon;
revoke insert, update, delete on orders from authenticated;

-- order_items ----------------------------------------------------------------
alter table order_items enable row level security;
drop policy if exists "Admin can read order_items" on order_items;
-- Никаких insert/update/delete политик (пункт 5): история позиций immutable.
drop policy if exists "Admin can insert order_items" on order_items;
drop policy if exists "Admin can update order_items" on order_items;
drop policy if exists "Admin can delete order_items" on order_items;

create policy "Admin can read order_items"
  on order_items for select
  to authenticated
  using (public.is_admin());

revoke insert, update, delete on order_items from anon;
revoke insert, update, delete on order_items from authenticated;

-- order_item_addons ----------------------------------------------------------
alter table order_item_addons enable row level security;
drop policy if exists "Admin can read order_item_addons" on order_item_addons;
drop policy if exists "Admin can insert order_item_addons" on order_item_addons;
drop policy if exists "Admin can update order_item_addons" on order_item_addons;
drop policy if exists "Admin can delete order_item_addons" on order_item_addons;

create policy "Admin can read order_item_addons"
  on order_item_addons for select
  to authenticated
  using (public.is_admin());

revoke insert, update, delete on order_item_addons from anon;
revoke insert, update, delete on order_item_addons from authenticated;

-- app_settings ---------------------------------------------------------------
-- Публично читаем только delivery_price, всё остальное — админ.
-- Значение delivery_price дополнительно валидируется CHECK-констрейнтом (см. п.1).
alter table app_settings enable row level security;
drop policy if exists "Public can read delivery price" on app_settings;
drop policy if exists "Admin can read settings" on app_settings;
drop policy if exists "Admin can insert settings" on app_settings;
drop policy if exists "Admin can update settings" on app_settings;
drop policy if exists "Admin can delete settings" on app_settings;

create policy "Public can read delivery price"
  on app_settings for select
  using (key = 'delivery_price');

create policy "Admin can read settings"
  on app_settings for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert settings"
  on app_settings for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update settings"
  on app_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Удалять настройки через клиент незачем (в т.ч. delivery_price).
revoke delete on app_settings from anon;
revoke delete on app_settings from authenticated;

-- ============================================================================
-- КОНЕЦ МИГРАЦИИ ЭТАПА 3.
-- Атомарное создание заказа (проверка вариантов/добавок, пересчёт всех цен из БД,
-- пересчёт line_total/subtotal/total, rate limiting) будет реализовано на
-- Этапе 5 server-side через service_role (или create_order RPC SECURITY DEFINER).
-- Именно там гарантируется межтабличный инвариант
--   orders.subtotal = SUM(order_items.line_total)
-- и
--   order_items.addons_total_per_unit = SUM(order_item_addons.line_total),
-- который нельзя выразить табличным CHECK. Клиент цены НЕ присылает.
-- ============================================================================
