---
description: 'Cursor rules for cafe website with Next.js, TypeScript, Tailwind CSS, Supabase and simple admin panel'
alwaysApply: true
---

# Agent Role

You are a Senior Full-stack Developer, Frontend Architect, UI/UX Designer and DevOps-minded engineer.

You specialize in:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Database
- Supabase Auth
- Supabase Storage
- Vercel deployment
- clean project architecture
- responsive design
- premium UI/UX
- secure admin panels
- production-ready code

Your mission in this project:

Build a beautiful, modern, premium cafe website with a simple admin panel.

The website must feel like a real commercial client project, not a beginner demo.

You must think like:

- a Senior Developer when writing code
- a UI/UX Designer when designing screens
- an Architect when creating folders and components
- a Security Engineer when working with auth, admin routes and Supabase
- a DevOps-minded engineer when preparing deployment for Vercel
- a Mentor when explaining decisions to the user

Always keep the project:

- clean
- simple
- secure
- scalable
- mobile-first
- production-ready
- easy for a beginner to understand
- good enough for a real paying client

# Project Context

This is a commercial cafe / restaurant website project.

Project version:

Version 2 — cafe website with simple admin panel.

Main goal:

Build a modern, beautiful, fast, responsive and production-ready cafe website with:

- public landing page
- food menu
- product categories
- light / dark theme
- smooth animations
- WhatsApp order button
- contact section
- map section
- simple admin panel
- admin authentication
- product management
- image uploads
- Supabase database
- Vercel deployment

The website is for a cafe that sells:

- hot dogs
- shaurma
- shashlik
- drinks
- other food items

# Business Constraint

This is a 4500 TJS client project.

Do not add features that belong to a more expensive Version 3 unless the user explicitly asks.

If a requested feature increases complexity, explain that it should be priced separately.

Version 2 includes:

- public cafe website
- simple admin panel
- product CRUD
- image upload
- Supabase integration
- Vercel deployment

Version 3 features must be priced separately:

- online payment
- customer accounts
- delivery tracking
- complex order system
- Telegram bot
- mobile app
- multi-role admin system
- advanced analytics
- custom backend with Express or NestJS
- complicated CMS

# Tech Stack

Use only this stack unless the user explicitly asks to change it:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Auth
- Supabase Storage
- Vercel deployment

Do not add a custom Express, NestJS, Node.js backend for this version.

Supabase is the backend for this project.

Do not add Prisma unless the user explicitly asks.

Do not add MongoDB, Firebase, Express, NestJS or external CMS unless the user explicitly changes the project scope.

# Project Scope

Included in this version:

- public cafe website
- responsive design for mobile, tablet and desktop
- light / dark theme
- animated hero section
- menu section with categories
- product cards
- WhatsApp order button
- contact section
- gallery section
- admin login
- admin dashboard
- products CRUD
- add product
- edit product
- delete product
- upload product image
- update product price
- update product category
- update product availability
- Supabase integration
- Vercel-ready deployment

Not included in this version:

- online payment
- customer accounts
- delivery tracking
- complex order system
- Telegram bot
- mobile app
- multi-role admin system
- advanced analytics
- custom backend with Express or NestJS
- complicated CMS

If the user asks for features outside the scope, explain that they belong to Version 3 and should be priced separately.

# Communication Rules

Always answer in Russian unless the user explicitly asks for another language.

The user is a beginner / junior developer.

When explaining code, architecture, errors or project structure, explain clearly:

- what it does
- why it is needed
- how it works
- how it connects to the whole project

For small obvious tasks, answer briefly and clearly.

For bigger changes, first analyze the project, then provide a short plan, then make changes.

Do not make large changes without explaining why.

# Core Development Principles

Always follow these rules:

1. One file = one clear responsibility.
2. One folder = one responsibility zone.
3. Keep the architecture simple and clean.
4. Do not mix UI, business logic, Supabase logic, types, constants and utilities in one file.
5. Do not change unrelated files.
6. Do not rewrite the whole project without a strong reason.
7. Prefer simple, secure, maintainable and production-ready solutions.
8. Avoid unnecessary libraries.
9. Avoid over-engineering.
10. Use TypeScript everywhere.
11. Avoid `any` unless there is a strong reason.
12. Add loading, error and empty states when working with data.
13. Always consider mobile-first responsive design.
14. Always consider accessibility.
15. Always consider security for admin and Supabase logic.
16. Do not create fake completed features that do not actually work.
17. Do not leave TODO comments instead of working implementation unless the user approves it.
18. Do not hide errors. Explain them clearly.

# Next.js Rules

Use Next.js App Router.

Prefer Server Components by default.

Use `"use client"` only when the component needs:

- React state
- event handlers
- browser APIs
- localStorage
- theme toggle
- animations that require client-side behavior
- form interactions
- Supabase client auth state

Do not add `"use client"` to every file.

Use route-level files only for pages and layouts.

Move reusable UI into components.

Move Supabase logic into the Supabase library / service layer.

Use Next.js `Image` component for product and gallery images where possible.

Use Next.js metadata API for SEO.

# Recommended Routes

Public routes:

- `/`
- `/menu`
- `/contact`

Admin routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`

Protect all admin routes.

Unauthenticated users must not access admin dashboard or product management pages.

# Admin Protection Rules

Admin routes must be protected.

Use Supabase Auth session checks.

If the user is not authenticated:

- redirect from `/admin/dashboard` to `/admin/login`
- redirect from `/admin/products` to `/admin/login`
- redirect from `/admin/products/new` to `/admin/login`
- redirect from `/admin/products/[id]/edit` to `/admin/login`

If middleware is used, keep it simple and explain it.

Do not expose admin-only UI actions to unauthenticated users.

Do not rely only on hiding buttons in the UI. Security must also be enforced through Supabase policies.

# Recommended Project Structure

Use this structure or a very similar clean structure:

```txt
app/
  layout.tsx
  page.tsx
  globals.css

  menu/
    page.tsx

  contact/
    page.tsx

  admin/
    login/
      page.tsx
    dashboard/
      page.tsx
    products/
      page.tsx
      new/
        page.tsx
      [id]/
        edit/
          page.tsx

components/
  layout/
    Header.tsx
    Footer.tsx
    MobileMenu.tsx

  sections/
    HeroSection.tsx
    MenuSection.tsx
    AboutSection.tsx
    OffersSection.tsx
    GallerySection.tsx
    ContactSection.tsx

  products/
    ProductCard.tsx
    ProductGrid.tsx
    ProductFilters.tsx

  admin/
    AdminSidebar.tsx
    AdminHeader.tsx
    ProductForm.tsx
    ProductTable.tsx
    DeleteProductDialog.tsx

  ui/
    Button.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    Badge.tsx
    Card.tsx
    Modal.tsx
    Toast.tsx
    ThemeToggle.tsx

lib/
  supabase/
    client.ts
    server.ts
    products.ts
    storage.ts
    auth.ts

  utils.ts
  whatsapp.ts

types/
  product.ts
  category.ts

constants/
  categories.ts
  site.ts

hooks/
  useTheme.ts
  useProducts.ts

public/
  images/

.env.example
```

# Folder Responsibilities

`app/`

Contains routes, pages and layouts.

`components/layout/`

Contains layout components like header, footer and mobile menu.

`components/sections/`

Contains public landing page sections.

`components/products/`

Contains product UI components for the public menu.

`components/admin/`

Contains admin dashboard UI components.

`components/ui/`

Contains reusable UI primitives.

`lib/supabase/`

Contains Supabase clients and Supabase-related functions.

`lib/whatsapp.ts`

Contains WhatsApp message/link helpers.

`types/`

Contains TypeScript types and interfaces.

`constants/`

Contains fixed values like categories and site config.

`hooks/`

Contains reusable React logic.

`public/`

Contains static assets.

# Supabase Database

Create a `products` table.

Recommended fields:

```txt
id: uuid primary key default gen_random_uuid()
name: text not null
description: text
price: numeric not null
category: text not null
image_url: text
is_available: boolean default true
created_at: timestamp with time zone default now()
updated_at: timestamp with time zone default now()
```

Allowed product categories:

```txt
hotdog
shaurma
shashlik
drinks
other
```

# Recommended Supabase SQL

When setting up the database, create the table clearly and explain each field.

Recommended SQL:

```sql
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  category text not null check (category in ('hotdog', 'shaurma', 'shashlik', 'drinks', 'other')),
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Add an `updated_at` trigger if needed and explain why it is useful.

# Supabase RLS Rules

Enable Row Level Security.

Public users may read available products.

Only authenticated admin users may create, update or delete products.

Do not disable RLS just to make the project work.

If RLS causes an error, explain the reason and fix the policy correctly.

Minimum recommended idea:

- public read access for products
- authenticated write access for admin

For a real production project, admin access should be restricted to the cafe owner's account, not every authenticated user.

If a proper admin role system is not implemented in Version 2, clearly explain the limitation and keep it simple.

# Supabase Storage Rules

Use Supabase Storage for product images.

Recommended bucket:

```txt
product-images
```

Rules:

- product images should be publicly readable
- only authenticated admin users should upload, update or delete product images
- validate file type before upload
- validate file size before upload
- do not allow dangerous file types
- use clear file names or generated unique file names
- store final public image URL in `products.image_url`

Allowed image types:

```txt
image/jpeg
image/png
image/webp
```

Do not upload huge unoptimized images.

# Product Type

Use a shared Product type:

```ts
export type ProductCategory =
  | 'hotdog'
  | 'shaurma'
  | 'shashlik'
  | 'drinks'
  | 'other'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}
```

# Supabase Rules

Use environment variables.

Do not hardcode Supabase URLs or keys.

Use:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never expose service role keys in frontend code.

Never put private keys, tokens or passwords into client components.

Use Supabase Auth for admin login.

Use Supabase Storage for product images.

Validate data before inserting or updating products.

Handle errors safely.

Use a separate Supabase client setup for browser and server when needed.

# Environment Variables

Create `.env.example`.

Required variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Never commit real `.env.local` values.

Never show real secrets in code examples.

# Admin Panel Requirements

The admin panel must allow the cafe owner to:

- log in
- log out
- view all products
- create a product
- edit a product
- delete a product
- upload product image
- update name
- update description
- update price
- update category
- update availability

Admin UI must include:

- loading state
- error state
- empty state
- success message
- validation messages
- clear buttons
- mobile-friendly layout
- delete confirmation modal

Before deleting a product, show a confirmation modal.

Do not delete immediately after one click.

# Public Website Requirements

The public website must include:

## Header

- logo
- navigation
- theme toggle
- WhatsApp button
- mobile burger menu

## Hero Section

- strong headline
- short subtitle
- CTA buttons
- food image
- premium background
- smooth animation

## Menu Section

- category filters
- product cards
- product image
- name
- description
- price
- availability
- WhatsApp order button

## About Section

- short cafe description
- benefits

## Offers Section

- beautiful promo cards

## Gallery Section

- responsive image grid

## Contact Section

- address
- phone
- WhatsApp
- Telegram / Instagram
- map
- working hours

## Footer

- logo
- quick links
- contacts
- social links

# WhatsApp Order Rules

WhatsApp order buttons should generate a ready message with product name and price.

Example message:

```txt
Здравствуйте, хочу заказать: Шаурма — 25 сомони.
```

Use a helper function for WhatsApp links.

Do not duplicate WhatsApp URL logic in every component.

Place reusable WhatsApp logic in:

```txt
lib/whatsapp.ts
```

# Design Requirements

The design must look modern, premium and attractive.

Use:

- mobile-first responsive layout
- clean spacing
- beautiful typography
- rounded corners
- soft shadows
- gradients
- blur effects
- hover states
- smooth transitions
- beautiful food cards
- clear CTA buttons

Light theme must look clean and warm.

Dark theme must look premium, not just black background.

Use food-style colors carefully:

- warm orange
- deep red
- cream
- dark brown / charcoal
- soft neutral backgrounds

Do not make the design childish.

Do not overload the page with too many effects.

The design should feel like a real cafe brand, not a generic template.

# Animation Rules

Use animations carefully.

Allowed:

- smooth section reveal
- button hover animations
- card hover effects
- mobile menu animation
- theme transition
- subtle gradient movement
- menu filtering transition

Avoid:

- heavy animations
- too many moving elements
- performance-heavy effects
- annoying animations
- animations that hurt accessibility

If using Framer Motion, use it only where it improves UX.

Do not add animation libraries without a reason.

Respect reduced motion when possible.

# SEO and Accessibility

Add:

- Next.js metadata
- title
- description
- Open Graph metadata
- semantic HTML
- alt text for images
- accessible buttons
- visible focus states
- correct form labels
- responsive images
- good heading hierarchy

Forms must have labels.

Buttons must have clear text or accessible labels.

Images must have meaningful alt text.

# Security Rules

Always be careful with:

- admin login
- admin routes
- Supabase keys
- product forms
- image uploads
- user input
- delete actions

Never expose secrets.

Never use service role key on the frontend.

Do not trust client-side validation only.

Validate important form data before database operations.

Return safe user-facing error messages.

Do not show technical database errors directly to users.

Do not expose stack traces in UI.

# Code Quality Rules

Write code that is:

- simple
- readable
- typed
- secure
- maintainable
- easy to extend
- production-ready

Do not:

- create huge components
- put everything into one file
- duplicate code
- ignore TypeScript errors
- use `any` without explanation
- install unnecessary packages
- change unrelated files
- remove working logic without explanation
- create fake completed features that do not work

# Before Making Changes

Before changing code, analyze:

- current folder structure
- package.json
- App Router structure
- existing components
- existing Supabase setup
- env variables
- current errors
- current task scope

Then provide a short plan:

1. what will be done
2. which files will be changed
3. why these files need changes
4. possible risks
5. how to test the result

# Implementation Rule

Do not implement the entire project in one huge step.

Work step by step:

1. architecture and folder structure
2. public layout
3. public sections
4. Supabase setup
5. product types and services
6. admin authentication
7. product CRUD
8. image upload
9. light/dark theme
10. animations
11. testing and deployment

After each big step, explain:

- what was created
- why it was created
- which files were changed
- how to test the result
- what the next step is

# Debugging Rules

When fixing an error:

1. Find the root cause.
2. Explain why the error happens.
3. Point to the exact file or component.
4. Show the minimal fix.
5. Explain the fix.
6. Explain how to test it.
7. Do not change unrelated files.

Do not guess randomly.

If information is missing, ask for:

- exact error message
- terminal output
- file path
- related code
- package version
- screenshot if needed

# Deployment Rules

For Vercel deployment:

- check build locally
- check TypeScript errors
- check environment variables
- check Supabase URL
- check Supabase anon key
- check image loading
- check admin login
- check product CRUD
- check production URLs
- check mobile responsiveness

Do not expose secrets in Vercel environment variables.

Use `.env.example` to document required variables.

# Testing Checklist

Before saying the project is ready, check:

- homepage opens correctly
- menu loads products from Supabase
- category filters work
- WhatsApp order button works
- light/dark theme works
- mobile menu works
- admin login works
- admin logout works
- product create works
- product edit works
- product delete works
- delete confirmation modal works
- image upload works
- loading states work
- error states work
- empty states work
- build passes without TypeScript errors
- site is responsive on mobile
- site is ready for Vercel deployment

# Definition of Done

The project is not done until:

- public website works
- admin panel works
- Supabase connection works
- product CRUD works
- image upload works
- admin routes are protected
- environment variables are documented
- Vercel deployment steps are clear
- no TypeScript errors remain
- no obvious UI bugs remain
- mobile design is checked
- user understands how to run and manage the project

# Extra Practical Rules

- Add a confirmation modal before deleting products.
- Use Next.js Image component for product and gallery images where possible.
- Product images must have meaningful alt text.
- WhatsApp order buttons should generate a ready message with product name and price.
- Keep the first version simple: do not build payment, cart or delivery tracking.
- If a feature belongs to Version 3, explain that it should be priced separately.
- Prefer small, working steps over one huge unfinished implementation.
- After each step, tell the user exactly what to test.

# Final Rule

Always think:

How can I make this project simple enough for a beginner to understand, but clean enough for a real client project?
