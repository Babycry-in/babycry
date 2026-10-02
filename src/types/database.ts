export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_handle: string;
  facebook_url: string;
  youtube_url: string;
  logo_url: string;
  free_shipping_threshold: number;
  standard_delivery_fee: number;
  whatsapp_order_template?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  image_url: string;
  banner_url?: string;
  mobile_banner_url?: string;
  display_order: number;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  cloudinary_url: string;
  cloudinary_public_id?: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  size?: string;
  color?: string;
  sku?: string;
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number | null;
  sku?: string;
  stock: number;
  category_id: string;
  subcategory_id?: string;
  category?: Category;
  brand: string;
  age_group?: string;
  gender?: 'Unisex' | 'Girls' | 'Boys' | 'Baby';
  sizes: string[];
  colors: string[];
  material?: string;
  features: string[];
  care_instructions?: string;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  desktop_image: string;
  mobile_image?: string;
  is_active: boolean;
  sort_order: number;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  image_url?: string;
  mobile_image_url?: string;
  is_active: boolean;
  display_order: number;
  metadata?: Record<string, any>;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  variant_snapshot?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Cash on Delivery';

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  delivery_instructions?: string;
  subtotal: number;
  delivery_charge: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  whatsapp_status: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface MediaItem {
  id: string;
  file_name: string;
  cloudinary_url: string;
  cloudinary_public_id?: string;
  width?: number;
  height?: number;
  format?: string;
  size_bytes?: number;
  used_by?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}
