-- ============================================================================
-- ЭТАП 2: Архитектура меню — варианты товаров и добавки
-- ----------------------------------------------------------------------------
-- Что делает эта миграция:
--   1. Создаёт таблицу product_variants (размеры/варианты одного товара).
--   2. Создаёт таблицу addons (глобальные добавки: сыр, сосиска и т.д.).
--   3. Создаёт связь many-to-many product_addons (какие добавки у какого товара).
--   4. Включает RLS по той же модели, что и для products:
--        - публичное чтение доступных записей;
--        - запись только для админов (public.is_admin()).
--
-- ЧТО ЭТА МИГРАЦИЯ НЕ ДЕЛАЕТ (важно):
--   - НЕ трогает и НЕ удаляет таблицу products и её данные.
--   - НЕ вставляет реальные товары / варианты / добавки (seed будет отдельно).
--   - НЕ меняет существующую схему products (кроме безопасного добавления
--     ссылок через внешние ключи в новых таблицах).
--   - НЕ выполняет никаких destructive-действий.
--
-- Миграция идемпотентна: повторный запуск безопасен.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) product_variants — варианты/размеры товара
-- ----------------------------------------------------------------------------
-- Пример: у «Шаурмы» будет 5 вариантов (20 / 30 / 40 / 50 / 100),
-- у «Шашлычной шаурмы» — 1 вариант (30).
-- Правило архитектуры: заказываемый товар имеет >= 1 варианта.
-- Цена заказа всегда берётся из variant.price на сервере.
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name_ru text not null,
  name_tg text not null,
  name_en text not null,
  price numeric not null check (price >= 0),
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists product_variants_product_id_idx
  on product_variants (product_id);

drop trigger if exists product_variants_updated_at on product_variants;
create trigger product_variants_updated_at
  before update on product_variants
  for each row
  execute function update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 2) addons — глобальные добавки (по 5 сомони)
-- ----------------------------------------------------------------------------
-- Добавки хранятся один раз и переиспользуются между товарами.
-- Так админ меняет цену/название добавки в одном месте.
create table if not exists addons (
  id uuid primary key default gen_random_uuid(),
  name_ru text not null,
  name_tg text not null,
  name_en text not null,
  price numeric not null check (price >= 0),
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists addons_updated_at on addons;
create trigger addons_updated_at
  before update on addons
  for each row
  execute function update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 3) product_addons — связь many-to-many (товар <-> добавка)
-- ----------------------------------------------------------------------------
-- Зачем нужна отдельная таблица связи:
--   - Одна добавка (например «сыр») применяется к МНОГИМ товарам.
--   - Один товар допускает НЕСКОЛЬКО добавок.
--   Это классическое отношение many-to-many, которое нельзя выразить
--   одним внешним ключом, поэтому нужна промежуточная таблица.
--
-- Семантика (Версия 2):
--   - Если у товара ЕСТЬ строки в product_addons → предлагаются только они.
--   - Если строк НЕТ → добавки для этого товара не предлагаются.
--   (На Этапе 7 сидом свяжем все food-товары с 5 добавками.)
create table if not exists product_addons (
  product_id uuid not null references products(id) on delete cascade,
  addon_id uuid not null references addons(id) on delete cascade,
  primary key (product_id, addon_id)
);

create index if not exists product_addons_addon_id_idx
  on product_addons (addon_id);

-- ----------------------------------------------------------------------------
-- 4) RLS: product_variants
-- ----------------------------------------------------------------------------
alter table product_variants enable row level security;

drop policy if exists "Public can read available variants" on product_variants;
drop policy if exists "Admin can read all variants" on product_variants;
drop policy if exists "Admin can insert variants" on product_variants;
drop policy if exists "Admin can update variants" on product_variants;
drop policy if exists "Admin can delete variants" on product_variants;

create policy "Public can read available variants"
  on product_variants for select
  using (is_available = true);

create policy "Admin can read all variants"
  on product_variants for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert variants"
  on product_variants for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update variants"
  on product_variants for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete variants"
  on product_variants for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5) RLS: addons
-- ----------------------------------------------------------------------------
alter table addons enable row level security;

drop policy if exists "Public can read available addons" on addons;
drop policy if exists "Admin can read all addons" on addons;
drop policy if exists "Admin can insert addons" on addons;
drop policy if exists "Admin can update addons" on addons;
drop policy if exists "Admin can delete addons" on addons;

create policy "Public can read available addons"
  on addons for select
  using (is_available = true);

create policy "Admin can read all addons"
  on addons for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert addons"
  on addons for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update addons"
  on addons for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete addons"
  on addons for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6) RLS: product_addons
-- ----------------------------------------------------------------------------
alter table product_addons enable row level security;

drop policy if exists "Public can read product addons" on product_addons;
drop policy if exists "Admin can insert product addons" on product_addons;
drop policy if exists "Admin can delete product addons" on product_addons;

-- Читать связи можно публично (нужно, чтобы меню показывало добавки товара)
create policy "Public can read product addons"
  on product_addons for select
  using (true);

create policy "Admin can insert product addons"
  on product_addons for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can delete product addons"
  on product_addons for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- КОНЕЦ МИГРАЦИИ ЭТАПА 2.
-- Таблицы orders / order_items / order_item_addons / app_settings будут
-- добавлены отдельной миграцией на Этапе 3 (checkout / заказы).
-- Seed реальных товаров, вариантов и добавок — отдельно на Этапе 7,
-- только после подтверждения клиента.
-- ============================================================================
