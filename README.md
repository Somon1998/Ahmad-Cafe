# Taste Street Café

Production-ready сайт кафе с админ-панелью на Next.js, TypeScript, Tailwind CSS и Supabase.

## Быстрый старт

```bash
npm install
cp .env.example .env.local
# Заполните переменные в .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный anon key (не service_role!) |
| `NEXT_PUBLIC_SITE_URL` | URL сайта (для SEO и OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp номер (только цифры) |

## Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполните `supabase/schema.sql` (таблицы, RLS, bucket и политики storage).
3. В **Authentication → Users** создайте пользователя (email + пароль).
4. В **SQL Editor** добавьте email каждого администратора в таблицу `admin_users` (можно несколько строк):

```sql
insert into admin_users (email) values ('ваш-email@example.com')
on conflict (email) do nothing;

insert into admin_users (email) values ('email-клиента@example.com')
on conflict (email) do nothing;
```

Только email из `admin_users` сможет создавать, редактировать и удалять блюда (и загружать фото). Пользователь в Authentication без строки в `admin_users` после входа увидит «доступ запрещён» и будет разлогинен.

**Storage:** bucket `product-images` создаётся скриптом из `schema.sql` (public). Публичное чтение — для меню на сайте; загрузка/удаление — только для `admin_users`.

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Главная |
| `/menu` | Полное меню |
| `/contact` | Контакты |
| `/admin/login` | Вход |
| `/admin/dashboard` | Дашборд |
| `/admin/products` | Список блюд |

## Деплой на Vercel

1. Подключите репозиторий к Vercel.
2. Добавьте все переменные из `.env.example`.
3. `NEXT_PUBLIC_SITE_URL` — ваш production URL.
4. Deploy.

## Скрипты

- `npm run dev` — разработка
- `npm run build` — production-сборка
- `npm run start` — запуск production
- `npm run lint` — ESLint
