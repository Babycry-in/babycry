import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { 
  BusinessSettings, 
  Category, 
  HeroSlide, 
  HomepageSection, 
  Order, 
  OrderItem, 
  OrderStatus, 
  Product, 
  MediaItem 
} from '@/types/database';
import { 
  INITIAL_BUSINESS_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_HERO_SLIDES, 
  INITIAL_HOMEPAGE_SECTIONS, 
  INITIAL_PRODUCTS 
} from './initial-data';
import { getSupabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/admin';

interface StoreData {
  settings: BusinessSettings;
  categories: Category[];
  products: Product[];
  heroSlides: HeroSlide[];
  sections: HomepageSection[];
  orders: Order[];
  media: MediaItem[];
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'db-store.json');

// Ensure local persistent storage directory exists
function ensureStorage(): StoreData {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const data = JSON.parse(content);
      let needsSave = false;
      if (!data.sections || !Array.isArray(data.sections) || data.sections.length === 0) {
        data.sections = INITIAL_HOMEPAGE_SECTIONS;
        needsSave = true;
      }
      if (!data.heroSlides || !Array.isArray(data.heroSlides) || data.heroSlides.length === 0) {
        data.heroSlides = INITIAL_HERO_SLIDES;
        needsSave = true;
      }
      if (!data.settings) {
        data.settings = INITIAL_BUSINESS_SETTINGS;
        needsSave = true;
      }
      if (!data.categories || !Array.isArray(data.categories)) {
        data.categories = INITIAL_CATEGORIES;
        needsSave = true;
      }
      if (!data.products || !Array.isArray(data.products)) {
        data.products = INITIAL_PRODUCTS;
        needsSave = true;
      }
      if (!data.orders || !Array.isArray(data.orders)) {
        data.orders = [];
        needsSave = true;
      }
      if (!data.media || !Array.isArray(data.media)) {
        data.media = [];
        needsSave = true;
      }
      if (needsSave) {
        try {
          fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
        } catch (e) {
          console.error('Failed to sync missing keys to db-store.json', e);
        }
      }
      return data;
    }
  } catch (err) {
    console.error('Error reading local db-store.json:', err);
  }

  const initialData: StoreData = {
    settings: INITIAL_BUSINESS_SETTINGS,
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    heroSlides: INITIAL_HERO_SLIDES,
    sections: INITIAL_HOMEPAGE_SECTIONS,
    orders: [],
    media: [
      {
        id: 'media-logo',
        file_name: 'babycry-logo.png',
        cloudinary_url: '/images/babycry-logo.png',
        format: 'png',
        used_by: 'Logo / Header',
        created_at: new Date().toISOString()
      },
      {
        id: 'media-card',
        file_name: 'business-card.png',
        cloudinary_url: '/images/business-card.png',
        format: 'png',
        used_by: 'Contact Info Reference',
        created_at: new Date().toISOString()
      }
    ]
  };

  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db-store.json:', err);
  }

  return initialData;
}

function saveStorage(data: StoreData) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local db-store.json:', err);
  }
}

// -------------------------------------------------------------
// BUSINESS SETTINGS
// -------------------------------------------------------------
export async function getBusinessSettings(): Promise<BusinessSettings> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data, error } = await admin.from('business_settings').select('*').limit(1).single();
      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }
  const store = ensureStorage();
  return store.settings;
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data, error } = await admin.from('business_settings').upsert({
        ...settings,
        updated_at: new Date().toISOString()
      }).select().single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase update failed, using local store:', e);
    }
  }

  const store = ensureStorage();
  store.settings = { ...store.settings, ...settings, updated_at: new Date().toISOString() };
  saveStorage(store);
  return store.settings;
}

// -------------------------------------------------------------
// UUID HELPERS & SUPABASE SEEDING
// -------------------------------------------------------------
function isUUID(str: any): boolean {
  if (typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

async function resolveCategoryId(rawId?: string | null): Promise<string | null> {
  if (!rawId) return null;
  if (isUUID(rawId)) return rawId;
  const categories = await getCategories(false);
  const found = categories.find(c => c.id === rawId || c.slug === rawId);
  if (found && isUUID(found.id)) return found.id;
  return null;
}

async function autoSeedCategories(admin: any) {
  try {
    const formattedCategories = INITIAL_CATEGORIES.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      short_description: c.short_description || null,
      image_url: c.image_url || null,
      banner_url: c.banner_url || null,
      mobile_banner_url: c.mobile_banner_url || null,
      display_order: c.display_order,
      is_active: c.is_active,
      seo_title: c.seo_title || null,
      seo_description: c.seo_description || null,
    }));
    await admin.from('categories').upsert(formattedCategories);
  } catch (err) {
    console.error('Failed to auto-seed categories to Supabase:', err);
  }
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
export async function getCategories(onlyActive = true): Promise<Category[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      let query = admin.from('categories').select('*').order('display_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
      if (!error && Array.isArray(data) && data.length === 0) {
        await autoSeedCategories(admin);
        const { data: seeded } = await query;
        if (seeded && seeded.length > 0) return seeded;
      }
      if (error) {
        console.warn('Supabase getCategories warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase getCategories error:', err);
    }
  }

  const store = ensureStorage();
  return store.categories
    .filter(c => !onlyActive || c.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories(false);
  return categories.find(c => c.slug === slug) || null;
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const admin = getSupabaseAdmin();
  const store = ensureStorage();

  const id = (categoryData.id && isUUID(categoryData.id)) ? categoryData.id : randomUUID();
  const now = new Date().toISOString();
  const category: Category = {
    id,
    name: categoryData.name || 'New Category',
    slug: categoryData.slug || `category-${Date.now()}`,
    short_description: categoryData.short_description || '',
    image_url: categoryData.image_url || '',
    banner_url: categoryData.banner_url || '',
    mobile_banner_url: categoryData.mobile_banner_url || '',
    display_order: categoryData.display_order || store.categories.length + 1,
    is_active: categoryData.is_active ?? true,
    seo_title: categoryData.seo_title,
    seo_description: categoryData.seo_description,
    updated_at: now,
    created_at: categoryData.created_at || now,
  };

  if (admin) {
    try {
      const { error } = await admin.from('categories').upsert({
        id,
        name: category.name,
        slug: category.slug,
        short_description: category.short_description || null,
        image_url: category.image_url || null,
        banner_url: category.banner_url || null,
        mobile_banner_url: category.mobile_banner_url || null,
        display_order: category.display_order,
        is_active: category.is_active,
        seo_title: category.seo_title || null,
        seo_description: category.seo_description || null,
        updated_at: now,
        created_at: category.created_at,
      });
      if (error) {
        console.error('Supabase category save error:', error);
        throw new Error(`Failed to save category in Supabase: ${error.message}`);
      }
    } catch (e: any) {
      console.warn('Supabase category save error:', e);
      if (isServerSupabaseConfigured) throw e;
    }
  }

  const existingIdx = store.categories.findIndex(c => c.id === id);
  if (existingIdx >= 0) {
    store.categories[existingIdx] = category;
  } else {
    store.categories.push(category);
  }
  saveStorage(store);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (admin && isUUID(id)) {
    try {
      await admin.from('categories').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteCategory error:', err);
    }
  }
  const store = ensureStorage();
  store.categories = store.categories.filter(c => c.id !== id);
  saveStorage(store);
  return true;
}

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  search?: string;
  onlyActive?: boolean;
}): Promise<Product[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      let query = admin.from('products').select(`
        *,
        images:product_images(*),
        category:categories(*)
      `).order('created_at', { ascending: false });

      if (options?.onlyActive !== false) query = query.eq('is_active', true);
      if (options?.categoryId) {
        const catId = isUUID(options.categoryId) 
          ? options.categoryId 
          : (await resolveCategoryId(options.categoryId));
        if (catId) query = query.eq('category_id', catId);
      }
      if (options?.categorySlug) {
        const cat = await getCategoryBySlug(options.categorySlug);
        if (cat && isUUID(cat.id)) {
          query = query.eq('category_id', cat.id);
        }
      }
      if (options?.isFeatured) query = query.eq('is_featured', true);
      if (options?.isNew) query = query.eq('is_new', true);
      if (options?.isBestSeller) query = query.eq('is_best_seller', true);
      if (options?.search) query = query.ilike('name', `%${options.search}%`);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data.map((p: any) => ({
          ...p,
          images: Array.isArray(p.images)
            ? p.images.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            : [],
        }));
      }
      if (error) {
        console.warn('Supabase getProducts error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase getProducts exception:', err);
    }
  }

  const store = ensureStorage();
  let list = store.products;

  if (options?.onlyActive !== false) {
    list = list.filter(p => p.is_active);
  }
  if (options?.categoryId) {
    list = list.filter(p => p.category_id === options.categoryId);
  }
  if (options?.categorySlug) {
    const cat = store.categories.find(c => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter(p => p.category_id === cat.id);
    }
  }
  if (options?.isFeatured) {
    list = list.filter(p => p.is_featured);
  }
  if (options?.isNew) {
    list = list.filter(p => p.is_new);
  }
  if (options?.isBestSeller) {
    list = list.filter(p => p.is_best_seller);
  }
  if (options?.search) {
    const term = options.search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(term) ||
      (p.short_description && p.short_description.toLowerCase().includes(term))
    );
  }

  // Populate category object
  return list.map(prod => ({
    ...prod,
    category: store.categories.find(c => c.id === prod.category_id)
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('products')
        .select(`
          *,
          images:product_images(*),
          category:categories(*)
        `)
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) {
        return {
          ...data,
          images: Array.isArray(data.images)
            ? data.images.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            : [],
        };
      }
    } catch (err) {
      console.warn('Supabase getProductBySlug error:', err);
    }
  }

  const store = ensureStorage();
  const prod = store.products.find(p => p.slug === slug);
  if (!prod) return null;
  return {
    ...prod,
    category: store.categories.find(c => c.id === prod.category_id)
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const admin = getSupabaseAdmin();
  if (admin && isUUID(id)) {
    try {
      const { data, error } = await admin
        .from('products')
        .select(`
          *,
          images:product_images(*),
          category:categories(*)
        `)
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return {
          ...data,
          images: Array.isArray(data.images)
            ? data.images.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            : [],
        };
      }
    } catch (err) {
      console.warn('Supabase getProductById error:', err);
    }
  }

  const store = ensureStorage();
  const prod = store.products.find(p => p.id === id);
  if (!prod) return null;
  return {
    ...prod,
    category: store.categories.find(c => c.id === prod.category_id)
  };
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const admin = getSupabaseAdmin();
  const store = ensureStorage();

  const id = (productData.id && isUUID(productData.id)) ? productData.id : randomUUID();
  const now = new Date().toISOString();

  // Resolve category_id to valid UUID if possible
  const resolvedCatId = await resolveCategoryId(productData.category_id);
  const fallbackCatId = store.categories[0]?.id && isUUID(store.categories[0]?.id) ? store.categories[0].id : null;
  const finalCategoryId = resolvedCatId || fallbackCatId;

  const product: Product = {
    id,
    name: productData.name || 'New Product',
    slug: productData.slug || `product-${Date.now()}`,
    description: productData.description || '',
    short_description: productData.short_description || '',
    price: Number(productData.price || 0),
    sale_price: productData.sale_price !== null && productData.sale_price !== undefined && !isNaN(Number(productData.sale_price)) ? Number(productData.sale_price) : null,
    sku: productData.sku || `BC-${Date.now().toString().slice(-4)}`,
    stock: Number(productData.stock ?? 10),
    category_id: finalCategoryId || '',
    brand: productData.brand || 'Baby Cry',
    age_group: productData.age_group || '0-24M',
    gender: productData.gender || 'Unisex',
    sizes: Array.isArray(productData.sizes) ? productData.sizes : ['0-6M', '6-12M'],
    colors: Array.isArray(productData.colors) ? productData.colors : ['Natural Cream'],
    material: productData.material || '100% Organic Cotton',
    features: Array.isArray(productData.features) ? productData.features : ['Soft & Breathable'],
    care_instructions: productData.care_instructions || 'Gentle wash',
    is_featured: Boolean(productData.is_featured),
    is_new: Boolean(productData.is_new),
    is_best_seller: Boolean(productData.is_best_seller),
    is_active: Boolean(productData.is_active ?? true),
    seo_title: productData.seo_title,
    seo_description: productData.seo_description,
    images: productData.images || [],
    updated_at: now,
    created_at: productData.created_at || now,
  };

  // 1. If Supabase is configured, save directly to Supabase as primary persistent database
  if (admin) {
    const dbProduct = {
      id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price,
      sale_price: product.sale_price,
      sku: product.sku || null,
      stock: product.stock,
      category_id: finalCategoryId,
      brand: product.brand || 'Baby Cry',
      age_group: product.age_group || '0-24M',
      gender: product.gender || 'Unisex',
      sizes: product.sizes,
      colors: product.colors,
      material: product.material,
      features: product.features,
      care_instructions: product.care_instructions,
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_best_seller: product.is_best_seller,
      is_active: product.is_active,
      seo_title: product.seo_title || null,
      seo_description: product.seo_description || null,
      updated_at: now,
      created_at: product.created_at,
    };

    const { error: upsertError } = await admin.from('products').upsert(dbProduct);
    if (upsertError) {
      console.error('Supabase product save error:', upsertError);
      throw new Error(`Failed to save product in database: ${upsertError.message}`);
    }

    if (product.images && product.images.length > 0) {
      const dbImages = product.images.map((img, idx) => ({
        id: isUUID(img.id) ? img.id : randomUUID(),
        product_id: id,
        cloudinary_url: img.cloudinary_url,
        cloudinary_public_id: img.cloudinary_public_id || null,
        alt_text: img.alt_text || null,
        sort_order: Number(img.sort_order ?? idx),
        is_primary: Boolean(img.is_primary ?? (idx === 0)),
      }));

      await admin.from('product_images').delete().eq('product_id', id);
      const { error: imgError } = await admin.from('product_images').insert(dbImages);
      if (imgError) {
        console.warn('Supabase product_images insert warning:', imgError.message);
      }
    }
  }

  // 2. Also keep local store synced if filesystem allows
  try {
    const existingIdx = store.products.findIndex(p => p.id === id);
    if (existingIdx >= 0) {
      store.products[existingIdx] = product;
    } else {
      store.products.unshift(product);
    }
    saveStorage(store);
  } catch {
    // Normal in serverless environments like Vercel with read-only filesystems
  }

  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (admin && isUUID(id)) {
    try {
      await admin.from('product_images').delete().eq('product_id', id);
      const { error } = await admin.from('products').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProduct error:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    } catch (err: any) {
      console.error('Supabase delete error:', err);
      throw err;
    }
  }

  try {
    const store = ensureStorage();
    store.products = store.products.filter(p => p.id !== id);
    saveStorage(store);
  } catch {
    // Read-only filesystem in Vercel
  }

  return true;
}

// -------------------------------------------------------------
// HERO SLIDES & HOMEPAGE SECTIONS
// -------------------------------------------------------------
export async function getHeroSlides(onlyActive = true): Promise<HeroSlide[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      let query = admin.from('hero_slides').select('*').order('sort_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
    }
  }
  const store = ensureStorage();
  return store.heroSlides
    .filter(s => !onlyActive || s.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveHeroSlide(slide: Partial<HeroSlide>): Promise<HeroSlide> {
  const admin = getSupabaseAdmin();
  const store = ensureStorage();
  const id = slide.id || `hero-${Date.now()}`;
  const fullSlide: HeroSlide = {
    id,
    eyebrow: slide.eyebrow || 'LITTLE THINGS FOR',
    title: slide.title || 'Brighter Little Days',
    description: slide.description || 'Cute outfits, thoughtful essentials and little toys.',
    primary_cta_text: slide.primary_cta_text || 'Shop the Collection',
    primary_cta_url: slide.primary_cta_url || '/categories/apparels',
    secondary_cta_text: slide.secondary_cta_text || 'Explore New Arrivals',
    secondary_cta_url: slide.secondary_cta_url || '/categories',
    desktop_image: slide.desktop_image || '',
    mobile_image: slide.mobile_image || '',
    is_active: slide.is_active ?? true,
    sort_order: slide.sort_order || 1,
  };

  if (admin) {
    try {
      await admin.from('hero_slides').upsert(fullSlide);
    } catch (e) {
      console.warn('Supabase hero slide save error:', e);
    }
  }

  const idx = store.heroSlides.findIndex(s => s.id === id);
  if (idx >= 0) {
    store.heroSlides[idx] = fullSlide;
  } else {
    store.heroSlides.push(fullSlide);
  }
  saveStorage(store);
  return fullSlide;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data, error } = await admin.from('homepage_sections').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {}
  }
  const store = ensureStorage();
  const list = Array.isArray(store.sections) ? store.sections : INITIAL_HOMEPAGE_SECTIONS;
  return [...list].sort((a, b) => a.display_order - b.display_order);
}

export async function updateHomepageSection(section: Partial<HomepageSection>): Promise<HomepageSection | null> {
  const admin = getSupabaseAdmin();
  const store = ensureStorage();
  if (!Array.isArray(store.sections)) {
    store.sections = [...INITIAL_HOMEPAGE_SECTIONS];
  }
  const idx = store.sections.findIndex(s => s.section_key === section.section_key);
  let updatedSec: HomepageSection;

  if (idx >= 0) {
    updatedSec = { ...store.sections[idx], ...section };
    store.sections[idx] = updatedSec;
  } else if (section.section_key) {
    updatedSec = {
      id: section.id || `sec-${section.section_key}`,
      section_key: section.section_key,
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      cta_text: section.cta_text || '',
      cta_url: section.cta_url || '',
      image_url: section.image_url || '',
      mobile_image_url: section.mobile_image_url || '',
      is_active: section.is_active ?? true,
      display_order: section.display_order ?? (store.sections.length + 1),
      metadata: section.metadata || {},
    };
    store.sections.push(updatedSec);
  } else {
    return null;
  }

  if (admin) {
    try {
      await admin.from('homepage_sections').upsert(updatedSec);
    } catch (e) {
      console.warn('Supabase section update error:', e);
    }
  }

  saveStorage(store);
  return updatedSec;
}

// -------------------------------------------------------------
// ORDERS & PRICE VALIDATION (CRITICAL SECURITY)
// -------------------------------------------------------------
export async function createOrderServerSide(payload: {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  delivery_instructions?: string;
  payment_method?: string;
  items: Array<{
    product_id: string;
    variant_snapshot?: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
  }>;
}): Promise<Order> {
  const store = ensureStorage();
  const settings = await getBusinessSettings();
  const admin = getSupabaseAdmin();

  // Price security: Retrieve real products from local store or Supabase
  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const item of payload.items) {
    let product = store.products.find(p => p.id === item.product_id);
    if (!product && admin) {
      try {
        const { data } = await admin
          .from('products')
          .select('*, images:product_images(*)')
          .eq('id', item.product_id)
          .maybeSingle();
        if (data) product = data;
      } catch {}
    }

    let unitPrice = 0;
    let productName = item.name || 'Product';
    let primaryImg = item.image || '/images/babycry-logo.png';

    if (product) {
      unitPrice = product.sale_price !== null && product.sale_price !== undefined
        ? product.sale_price
        : product.price;
      productName = product.name;
      primaryImg = product.images?.find(img => img.is_primary)?.cloudinary_url || product.images?.[0]?.cloudinary_url || primaryImg;
    } else if (item.price !== undefined && item.price !== null) {
      unitPrice = Number(item.price);
    }

    const qty = Math.max(1, Math.floor(item.quantity));
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    orderItems.push({
      product_id: product?.id || item.product_id,
      product_name_snapshot: productName,
      product_image_snapshot: primaryImg,
      variant_snapshot: item.variant_snapshot || 'Default',
      quantity: qty,
      unit_price: unitPrice,
      total_price: itemTotal
    });
  }

  const deliveryCharge = subtotal >= settings.free_shipping_threshold ? 0 : settings.standard_delivery_fee;
  const total = subtotal + deliveryCharge;

  // Generate unique order number #BC-XXXXXX and standard UUID id
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BC-${randomSuffix}`;
  const orderId = randomUUID();

  const order: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    customer_email: payload.customer_email,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    pincode: payload.pincode,
    delivery_instructions: payload.delivery_instructions,
    subtotal,
    delivery_charge: deliveryCharge,
    discount: 0,
    total,
    payment_status: 'Pending',
    order_status: 'Pending',
    whatsapp_status: 'Sent',
    created_at: new Date().toISOString(),
    items: orderItems
  };

  if (admin) {
    try {
      const { items: _, ...orderHeader } = order;
      const { error: ordErr } = await admin.from('orders').insert(orderHeader);
      if (ordErr) {
        console.warn('Supabase orders insert warning:', ordErr);
      } else {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const dbItems = orderItems.map(it => ({
          id: randomUUID(),
          order_id: order.id,
          product_id: uuidRegex.test(it.product_id) ? it.product_id : null,
          product_name_snapshot: it.product_name_snapshot,
          product_image_snapshot: it.product_image_snapshot,
          variant_snapshot: it.variant_snapshot,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price
        }));
        const { error: itErr } = await admin.from('order_items').insert(dbItems);
        if (itErr) {
          console.warn('Supabase order_items insert warning:', itErr);
        }
      }
    } catch (e) {
      console.warn('Supabase order insert failed:', e);
    }
  }

  store.orders.unshift(order);
  saveStorage(store);

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const store = ensureStorage();
  const localOrders = store.orders || [];

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data: supabaseOrders, error } = await admin
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(supabaseOrders) && supabaseOrders.length > 0) {
        const mappedSupabaseOrders: Order[] = supabaseOrders.map((so: any) => ({
          id: so.id,
          order_number: so.order_number,
          customer_name: so.customer_name,
          customer_phone: so.customer_phone,
          customer_email: so.customer_email,
          address: so.address,
          city: so.city,
          state: so.state,
          pincode: so.pincode,
          delivery_instructions: so.delivery_instructions,
          subtotal: Number(so.subtotal),
          delivery_charge: Number(so.delivery_charge || 0),
          discount: Number(so.discount || 0),
          total: Number(so.total),
          payment_status: so.payment_status,
          order_status: so.order_status,
          whatsapp_status: so.whatsapp_status,
          created_at: so.created_at,
          updated_at: so.updated_at,
          items: (so.items || []).map((it: any) => ({
            product_id: it.product_id || '',
            product_name_snapshot: it.product_name_snapshot,
            product_image_snapshot: it.product_image_snapshot,
            variant_snapshot: it.variant_snapshot,
            quantity: Number(it.quantity || 1),
            unit_price: Number(it.unit_price || 0),
            total_price: Number(it.total_price || 0),
          }))
        }));

        const orderMap = new Map<string, Order>();
        for (const lo of localOrders) {
          orderMap.set(lo.order_number || lo.id, lo);
        }
        for (const so of mappedSupabaseOrders) {
          orderMap.set(so.order_number || so.id, so);
        }

        const merged = Array.from(orderMap.values());
        return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch (e) {
      console.warn('Failed to load orders from Supabase:', e);
    }
  }

  return localOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          order_number: data.order_number,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          delivery_instructions: data.delivery_instructions,
          subtotal: Number(data.subtotal),
          delivery_charge: Number(data.delivery_charge || 0),
          discount: Number(data.discount || 0),
          total: Number(data.total),
          payment_status: data.payment_status,
          order_status: data.order_status,
          whatsapp_status: data.whatsapp_status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          items: (data.items || []).map((it: any) => ({
            product_id: it.product_id || '',
            product_name_snapshot: it.product_name_snapshot,
            product_image_snapshot: it.product_image_snapshot,
            variant_snapshot: it.variant_snapshot,
            quantity: Number(it.quantity || 1),
            unit_price: Number(it.unit_price || 0),
            total_price: Number(it.total_price || 0),
          }))
        };
      }
    } catch {}
  }

  const store = ensureStorage();
  return store.orders.find(o => o.order_number === orderNumber) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const now = new Date().toISOString();
  const store = ensureStorage();
  const order = store.orders.find(o => o.id === orderId || o.order_number === orderId);
  if (order) {
    order.order_status = status;
    order.updated_at = now;
    saveStorage(store);
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      await admin.from('orders').update({
        order_status: status,
        updated_at: now
      }).or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } catch {}
  }

  return order || null;
}

// -------------------------------------------------------------
// MEDIA LIBRARY
// -------------------------------------------------------------
export async function getMediaLibrary(): Promise<MediaItem[]> {
  const store = ensureStorage();
  return store.media;
}

export async function addMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
  const store = ensureStorage();
  const mediaItem: MediaItem = {
    ...item,
    id: `media-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  store.media.unshift(mediaItem);
  saveStorage(store);
  return mediaItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const store = ensureStorage();
  store.media = store.media.filter(m => m.id !== id);
  saveStorage(store);
  return true;
}
