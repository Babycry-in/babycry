import { Product, ProductImage } from './database';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  categoryName?: string;
  inStock: boolean;
}

export interface CheckoutFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  paymentMethod: 'cod' | 'whatsapp';
}
