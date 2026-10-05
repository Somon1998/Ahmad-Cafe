-- Мультиязычные поля для products (RU / TG / EN)
-- Старые name и description сохраняются и синхронизируются с русской версией.

alter table products
  add column if not exists name_ru text,
  add column if not exists name_tg text,
  add column if not exists name_en text,
  add column if not exists description_ru text,
  add column if not exists description_tg text,
  add column if not exists description_en text;

-- Заполнение из существующих name / description
update products
set
  name_ru = coalesce(nullif(trim(name_ru), ''), name),
  name_tg = coalesce(nullif(trim(name_tg), ''), name),
  name_en = coalesce(nullif(trim(name_en), ''), name),
  description_ru = coalesce(description_ru, description),
  description_tg = coalesce(description_tg, description),
  description_en = coalesce(description_en, description)
where
  name_ru is null
  or name_tg is null
  or name_en is null
  or (name_ru = '' and name is not null);

-- Синхронизация legacy-полей с русской версией
update products
set
  name = name_ru,
  description = description_ru
where name_ru is not null;

alter table products
  alter column name_ru set not null,
  alter column name_tg set not null,
  alter column name_en set not null;
