import fs from 'fs';
import path from 'path';
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
// CATEGORIES
// -------------------------------------------------------------
export async function getCategories(onlyActive = true): Promise<Category[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      let query = admin.from('categories').select('*').order('display_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
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

  const id = categoryData.id || `cat-${Date.now()}`;
  const now = new Date().toISOString();
  const category: Category = {
    id,
    name: categoryData.name || 'New Category',
    slug: categoryData.slug || `category-${Date.now()}`,
    short_description: categoryData.short_description || '',
    image_url: categoryData.image_url || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
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
      await admin.from('categories').upsert(category);
    } catch (e) {
      console.warn('Supabase category save error:', e);
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
  if (admin) {
    try {
      await admin.from('categories').delete().eq('id', id);
    } catch {}
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
      if (options?.categoryId) query = query.eq('category_id', options.categoryId);
      if (options?.isFeatured) query = query.eq('is_featured', true);
      if (options?.isNew) query = query.eq('is_new', true);
      if (options?.isBestSeller) query = query.eq('is_best_seller', true);
      if (options?.search) query = query.ilike('name', `%${options.search}%`);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
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
  const store = ensureStorage();
  const prod = store.products.find(p => p.slug === slug);
  if (!prod) return null;
  return {
    ...prod,
    category: store.categories.find(c => c.id === prod.category_id)
  };
}

export async function getProductById(id: string): Promise<Product | null> {
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

  const id = productData.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();

  const product: Product = {
    id,
    name: productData.name || 'New Product',
    slug: productData.slug || `product-${Date.now()}`,
    description: productData.description || '',
    short_description: productData.short_description || '',
    price: Number(productData.price || 0),
    sale_price: productData.sale_price ? Number(productData.sale_price) : null,
    sku: productData.sku || `BC-${Date.now().toString().slice(-4)}`,
    stock: Number(productData.stock ?? 10),
    category_id: productData.category_id || store.categories[0]?.id || '',
    brand: productData.brand || 'Baby Cry',
    age_group: productData.age_group || '0-24M',
    gender: productData.gender || 'Unisex',
    sizes: productData.sizes || ['0-6M', '6-12M'],
    colors: productData.colors || ['Natural Cream'],
    material: productData.material || '100% Organic Cotton',
    features: productData.features || ['Soft & Breathable'],
    care_instructions: productData.care_instructions || 'Gentle wash',
    is_featured: productData.is_featured ?? false,
    is_new: productData.is_new ?? false,
    is_best_seller: productData.is_best_seller ?? false,
    is_active: productData.is_active ?? true,
    seo_title: productData.seo_title,
    seo_description: productData.seo_description,
    images: productData.images && productData.images.length > 0 ? productData.images : [
      {
        id: `img-${Date.now()}`,
        cloudinary_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
        alt_text: productData.name || 'Product Image',
        sort_order: 0,
        is_primary: true
      }
    ],
    updated_at: now,
    created_at: productData.created_at || now,
  };

  if (admin) {
    try {
      const { images, category, ...rest } = product;
      await admin.from('products').upsert(rest);
      if (images && images.length > 0) {
        await admin.from('product_images').delete().eq('product_id', id);
        await admin.from('product_images').insert(
          images.map(img => ({
            product_id: id,
            cloudinary_url: img.cloudinary_url,
            cloudinary_public_id: img.cloudinary_public_id,
            alt_text: img.alt_text,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
          }))
        );
      }
    } catch (e) {
      console.warn('Supabase product save error:', e);
    }
  }

  const existingIdx = store.products.findIndex(p => p.id === id);
  if (existingIdx >= 0) {
    store.products[existingIdx] = product;
  } else {
    store.products.unshift(product);
  }
  saveStorage(store);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      await admin.from('products').delete().eq('id', id);
    } catch {}
  }
  const store = ensureStorage();
  store.products = store.products.filter(p => p.id !== id);
  saveStorage(store);
  return true;
}

// -------------------------------------------------------------
// HERO SLIDES & HOMEPAGE SECTIONS
// -------------------------------------------------------------
export async function getHeroSlides(onlyActive = true): Promise<HeroSlide[]> {
  const store = ensureStorage();
  return store.heroSlides
    .filter(s => !onlyActive || s.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveHeroSlide(slide: Partial<HeroSlide>): Promise<HeroSlide> {
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
    desktop_image: slide.desktop_image || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
    mobile_image: slide.mobile_image || '',
    is_active: slide.is_active ?? true,
    sort_order: slide.sort_order || 1,
  };

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
  const store = ensureStorage();
  return store.sections.sort((a, b) => a.display_order - b.display_order);
}

export async function updateHomepageSection(section: Partial<HomepageSection>): Promise<HomepageSection | null> {
  const store = ensureStorage();
  const idx = store.sections.findIndex(s => s.section_key === section.section_key);
  if (idx >= 0) {
    store.sections[idx] = { ...store.sections[idx], ...section };
    saveStorage(store);
    return store.sections[idx];
  } else if (section.section_key) {
    const newSection: HomepageSection = {
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
    store.sections.push(newSection);
    saveStorage(store);
    return newSection;
  }
  return null;
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
  }>;
}): Promise<Order> {
  const store = ensureStorage();
  const settings = await getBusinessSettings();

  // Price security: Retrieve real products from database
  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const item of payload.items) {
    const product = store.products.find(p => p.id === item.product_id);
    if (!product) {
      throw new Error(`Product not found: ${item.product_id}`);
    }

    const unitPrice = product.sale_price !== null && product.sale_price !== undefined
      ? product.sale_price
      : product.price;

    const qty = Math.max(1, Math.floor(item.quantity));
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    const primaryImg = product.images.find(img => img.is_primary)?.cloudinary_url || product.images[0]?.cloudinary_url || '';

    orderItems.push({
      product_id: product.id,
      product_name_snapshot: product.name,
      product_image_snapshot: primaryImg,
      variant_snapshot: item.variant_snapshot || 'Default',
      quantity: qty,
      unit_price: unitPrice,
      total_price: itemTotal
    });
  }

  const deliveryCharge = subtotal >= settings.free_shipping_threshold ? 0 : settings.standard_delivery_fee;
  const total = subtotal + deliveryCharge;

  // Generate unique order number #BC-XXXXXX
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BC-${randomSuffix}`;

  const order: Order = {
    id: `order-${Date.now()}`,
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

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { items: _, ...orderHeader } = order;
      await admin.from('orders').insert(orderHeader);
      await admin.from('order_items').insert(
        orderItems.map(it => ({
          order_id: order.id,
          ...it
        }))
      );
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
  return store.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const store = ensureStorage();
  return store.orders.find(o => o.order_number === orderNumber) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const store = ensureStorage();
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return null;

  order.order_status = status;
  order.updated_at = new Date().toISOString();

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      await admin.from('orders').update({
        order_status: status,
        updated_at: order.updated_at
      }).eq('id', orderId);
    } catch {}
  }

  saveStorage(store);
  return order;
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
