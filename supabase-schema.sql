-- ==============================================================================
-- BABY CRY.IN - PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BUSINESS SETTINGS
create table if not exists public.business_settings (
    id uuid primary key default gen_random_uuid(),
    business_name text not null default 'Baby Cry.in',
    tagline text default 'Little things for brighter little days',
    phone text not null default '8136 819192',
    whatsapp_number text not null default '8136 819192',
    email text not null default 'babycry.inbc@gmail.com',
    address text not null default 'Pandikkad, Wandoor Road, Kanjirapadi',
    instagram_handle text not null default 'Baby_cry.in',
    facebook_url text default 'https://facebook.com',
    youtube_url text default 'https://youtube.com',
    logo_url text default '/images/babycry-logo.png',
    free_shipping_threshold numeric default 999,
    standard_delivery_fee numeric default 99,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. CATEGORIES
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    short_description text,
    image_url text,
    banner_url text,
    mobile_banner_url text,
    display_order integer default 0,
    is_active boolean default true,
    seo_title text,
    seo_description text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_order on public.categories (display_order);

-- 3. SUBCATEGORIES
create table if not exists public.subcategories (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references public.categories(id) on delete cascade,
    name text not null,
    slug text not null,
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. PRODUCTS
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    short_description text,
    price numeric(10, 2) not null,
    sale_price numeric(10, 2),
    sku text,
    stock integer not null default 0,
    category_id uuid references public.categories(id) on delete set null,
    subcategory_id uuid references public.subcategories(id) on delete set null,
    brand text default 'Baby Cry',
    age_group text default '0-24 Months',
    gender text default 'Unisex',
    sizes text[] default '{}',
    colors text[] default '{}',
    material text default '100% Organic Cotton',
    features text[] default '{}',
    care_instructions text default 'Machine wash gentle, tumble dry low',
    is_featured boolean default false,
    is_new boolean default false,
    is_best_seller boolean default false,
    is_active boolean default true,
    seo_title text,
    seo_description text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_is_active on public.products (is_active);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- 5. PRODUCT IMAGES
create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade,
    cloudinary_url text not null,
    cloudinary_public_id text,
    alt_text text,
    sort_order integer default 0,
    is_primary boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_product_images_product on public.product_images (product_id);

-- 6. PRODUCT VARIANTS
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade,
    title text not null,
    size text,
    color text,
    sku text,
    price numeric(10, 2),
    stock integer default 0
);

-- 7. HERO SLIDES
create table if not exists public.hero_slides (
    id uuid primary key default gen_random_uuid(),
    eyebrow text default 'LITTLE THINGS FOR',
    title text not null default 'Brighter Little Days',
    description text default 'Cute outfits, thoughtful essentials and little toys for your little one.',
    primary_cta_text text default 'Shop the Collection',
    primary_cta_url text default '/categories/apparels',
    secondary_cta_text text default 'Explore New Arrivals',
    secondary_cta_url text default '/categories',
    desktop_image text,
    mobile_image text,
    is_active boolean default true,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. HOMEPAGE SECTIONS
create table if not exists public.homepage_sections (
    id uuid primary key default gen_random_uuid(),
    section_key text not null unique,
    title text not null,
    subtitle text,
    description text,
    cta_text text,
    cta_url text,
    image_url text,
    mobile_image_url text,
    is_active boolean default true,
    display_order integer default 0,
    metadata jsonb default '{}'::jsonb
);

-- 9. ORDERS
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    customer_id uuid,
    customer_name text not null,
    customer_phone text not null,
    customer_email text not null,
    address text not null,
    city text not null,
    state text not null,
    pincode text not null,
    delivery_instructions text,
    subtotal numeric(10, 2) not null,
    delivery_charge numeric(10, 2) not null default 0,
    discount numeric(10, 2) not null default 0,
    total numeric(10, 2) not null,
    payment_status text not null default 'Pending',
    order_status text not null default 'Pending',
    whatsapp_status text not null default 'Sent',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_orders_number on public.orders (order_number);
create index if not exists idx_orders_created on public.orders (created_at desc);

-- 10. ORDER ITEMS (WITH IMMUTABLE PRODUCT SNAPSHOTS)
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name_snapshot text not null,
    product_image_snapshot text,
    variant_snapshot text,
    quantity integer not null default 1,
    unit_price numeric(10, 2) not null,
    total_price numeric(10, 2) not null
);

create index if not exists idx_order_items_order on public.order_items (order_id);

-- 11. REVIEWS
create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade,
    customer_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    is_verified boolean default false,
    is_approved boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 12. WISHLISTS & WISHLIST ITEMS
create table if not exists public.wishlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.wishlist_items (
    id uuid primary key default gen_random_uuid(),
    wishlist_id uuid references public.wishlists(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(wishlist_id, product_id)
);

-- 13. MEDIA LIBRARY
create table if not exists public.media_library (
    id uuid primary key default gen_random_uuid(),
    file_name text not null,
    cloudinary_url text not null,
    cloudinary_public_id text,
    width integer,
    height integer,
    format text,
    size_bytes integer,
    used_by text default 'General',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.business_settings enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;

alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.hero_slides enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.media_library enable row level security;

-- Public Read Policies
drop policy if exists "Allow public read on business_settings" on public.business_settings;
create policy "Allow public read on business_settings" on public.business_settings for select using (true);

drop policy if exists "Allow public read on categories" on public.categories;
create policy "Allow public read on categories" on public.categories for select using (is_active = true);

drop policy if exists "Allow public read on subcategories" on public.subcategories;
create policy "Allow public read on subcategories" on public.subcategories for select using (is_active = true);

drop policy if exists "Allow public read on products" on public.products;
create policy "Allow public read on products" on public.products for select using (is_active = true);

drop policy if exists "Allow public read on product_images" on public.product_images;
create policy "Allow public read on product_images" on public.product_images for select using (true);

drop policy if exists "Allow public read on product_variants" on public.product_variants;
create policy "Allow public read on product_variants" on public.product_variants for select using (true);

drop policy if exists "Allow public read on hero_slides" on public.hero_slides;
create policy "Allow public read on hero_slides" on public.hero_slides for select using (is_active = true);

drop policy if exists "Allow public read on homepage_sections" on public.homepage_sections;
create policy "Allow public read on homepage_sections" on public.homepage_sections for select using (is_active = true);

drop policy if exists "Allow public read on reviews" on public.reviews;
create policy "Allow public read on reviews" on public.reviews for select using (is_approved = true);

-- Orders Policies: Public & Admin can insert, view, update status, and manage orders
drop policy if exists "Allow public insert on orders" on public.orders;
create policy "Allow public insert on orders" on public.orders for insert with check (true);

drop policy if exists "Allow public read on orders" on public.orders;
create policy "Allow public read on orders" on public.orders for select using (true);

drop policy if exists "Allow public update on orders" on public.orders;
create policy "Allow public update on orders" on public.orders for update using (true) with check (true);

drop policy if exists "Allow public delete on orders" on public.orders;
create policy "Allow public delete on orders" on public.orders for delete using (true);

drop policy if exists "Allow public insert on order_items" on public.order_items;
create policy "Allow public insert on order_items" on public.order_items for insert with check (true);

drop policy if exists "Allow public read on order_items" on public.order_items;
create policy "Allow public read on order_items" on public.order_items for select using (true);

drop policy if exists "Allow public update on order_items" on public.order_items;
create policy "Allow public update on order_items" on public.order_items for update using (true) with check (true);

drop policy if exists "Allow public delete on order_items" on public.order_items;
create policy "Allow public delete on order_items" on public.order_items for delete using (true);

-- Admin Full Access Policies (for anon API key if service_role is not set)
drop policy if exists "Allow full access on categories" on public.categories;
create policy "Allow full access on categories" on public.categories for all using (true) with check (true);

drop policy if exists "Allow full access on subcategories" on public.subcategories;
create policy "Allow full access on subcategories" on public.subcategories for all using (true) with check (true);

drop policy if exists "Allow full access on products" on public.products;
create policy "Allow full access on products" on public.products for all using (true) with check (true);

drop policy if exists "Allow full access on product_images" on public.product_images;
create policy "Allow full access on product_images" on public.product_images for all using (true) with check (true);

drop policy if exists "Allow full access on product_variants" on public.product_variants;
create policy "Allow full access on product_variants" on public.product_variants for all using (true) with check (true);

drop policy if exists "Allow full access on hero_slides" on public.hero_slides;
create policy "Allow full access on hero_slides" on public.hero_slides for all using (true) with check (true);

drop policy if exists "Allow full access on homepage_sections" on public.homepage_sections;
create policy "Allow full access on homepage_sections" on public.homepage_sections for all using (true) with check (true);

drop policy if exists "Allow full access on business_settings" on public.business_settings;
create policy "Allow full access on business_settings" on public.business_settings for all using (true) with check (true);

drop policy if exists "Allow full access on media_library" on public.media_library;
create policy "Allow full access on media_library" on public.media_library for all using (true) with check (true);

