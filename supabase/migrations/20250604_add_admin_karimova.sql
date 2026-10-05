-- Второй администратор (клиент). Пользователь уже создан в Authentication.
-- Выполните в Supabase → SQL Editor (или через supabase db push, если CLI привязан к проекту).

insert into admin_users (email)
values ('karimova.farzona@gmail.com')
on conflict (email) do nothing;
