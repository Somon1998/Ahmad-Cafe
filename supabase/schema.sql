-- Таблица блюд
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  name_ru text not null,
  name_tg text not null,
  name_en text not null,
  description_ru text,
  description_tg text,
  description_en text,
  price numeric not null check (price >= 0),
  category text not null check (
    category in ('hotdog', 'shaurma', 'shashlik', 'drinks', 'other')
  ),
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Список администраторов (Version 2: несколько email, по одной строке на админа)
create table if not exists admin_users (
  email text primary key
);

-- Автообновление updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- Проверка: текущий пользователь — администратор из admin_users
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- RLS: products
alter table products enable row level security;

drop policy if exists "Public can read available products" on products;
drop policy if exists "Authenticated can read all products" on products;
drop policy if exists "Authenticated can insert products" on products;
drop policy if exists "Authenticated can update products" on products;
drop policy if exists "Authenticated can delete products" on products;

-- Публичное чтение доступных блюд (сайт и меню)
create policy "Public can read available products"
  on products for select
  using (is_available = true);

-- Админ читает все блюда (включая скрытые)
create policy "Admin can read all products"
  on products for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert products"
  on products for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update products"
  on products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete products"
  on products for delete
  to authenticated
  using (public.is_admin());

-- RLS: admin_users (пользователь может проверить только свой email)
alter table admin_users enable row level security;

drop policy if exists "User can read own admin row" on admin_users;
create policy "User can read own admin row"
  on admin_users for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- После создания пользователя в Authentication добавьте каждый admin email:
-- insert into admin_users (email) values ('owner@example.com')
-- on conflict (email) do nothing;
-- insert into admin_users (email) values ('client@example.com')
-- on conflict (email) do nothing;

-- Storage: bucket product-images
-- 1) Dashboard → Storage → New bucket
--    Name: product-images
--    Public bucket: ON
-- 2) Выполните политики ниже в SQL Editor:

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Admin update product images" on storage.objects;
drop policy if exists "Admin delete product images" on storage.objects;

-- Публичное чтение изображений меню
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "Admin update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admin delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- Примеры данных (опционально; удалите на production)
insert into products (
  name,
  description,
  name_ru,
  name_tg,
  name_en,
  description_ru,
  description_tg,
  description_en,
  price,
  category,
  is_available
) values
  (
    'Классический хот-дог',
    'Сочная сосиска, хрустящий булочка и фирменный соус',
    'Классический хот-дог',
    'Классический хот-дог',
    'Классический хот-дог',
    'Сочная сосиска, хрустящий булочка и фирменный соус',
    'Сочная сосиска, хрустящий булочка и фирменный соус',
    'Сочная сосиска, хрустящий булочка и фирменный соус',
    18,
    'hotdog',
    true
  ),
  (
    'Шаурма классическая',
    'Курица, свежие овощи, чесночный соус',
    'Шаурма классическая',
    'Шаурма классическая',
    'Шаурма классическая',
    'Курица, свежие овощи, чесночный соус',
    'Курица, свежие овощи, чесночный соус',
    'Курица, свежие овощи, чесночный соус',
    25,
    'shaurma',
    true
  ),
  (
    'Шашлык из баранины',
    '200 г, маринованное мясо с луком',
    'Шашлык из баранины',
    'Шашлык из баранины',
    'Шашлык из баранины',
    '200 г, маринованное мясо с луком',
    '200 г, маринованное мясо с луком',
    '200 г, маринованное мясо с луком',
    35,
    'shashlik',
    true
  ),
  (
    'Лимонад домашний',
    'Освежающий цитрусовый напиток 0.5л',
    'Лимонад домашний',
    'Лимонад домашний',
    'Лимонад домашний',
    'Освежающий цитрусовый напиток 0.5л',
    'Освежающий цитрусовый напиток 0.5л',
    'Освежающий цитрусовый напиток 0.5л',
    8,
    'drinks',
    true
  )
;
