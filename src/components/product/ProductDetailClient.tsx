'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductDetailClient({ product, whatsappNumber }: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'placeholder', cloudinary_url: '/images/babycry-logo.png', is_primary: true, sort_order: 0 }];

  const [activeImage, setActiveImage] = useState(images[0]?.cloudinary_url);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: activeImage,
      quantity,
      selectedSize,
      selectedColor,
      maxStock: product.stock,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsAppQuickOrder = () => {
    const text = `Hello Baby Cry.in! 🛍️\nI would like to order:\n\n*${product.name}*\nSize: ${selectedSize || 'Standard'}\nColor: ${selectedColor || 'Standard'}\nQuantity: ${quantity}\nPrice: ₹${price * quantity}\n\nPlease confirm availability and payment options!`;
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      
      {/* LEFT: Product Gallery */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Big View */}
        <div className="relative aspect-square w-full rounded-[36px] overflow-hidden bg-white shadow-md border border-emerald-50">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-cover"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_new && (
              <span className="px-3 py-1 bg-[#B9E6D3] text-[#1A5741] text-xs font-bold uppercase rounded-full shadow-xs">
                New Arrival
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 bg-[#FFE5D9] text-[#C44D25] text-xs font-bold rounded-full shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.cloudinary_url)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img.cloudinary_url
                    ? 'border-emerald-600 scale-105 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.cloudinary_url}
                  alt={img.alt_text || product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Details & Purchase Actions */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800/80">
              {product.category?.name || product.brand || 'Baby Cry'}
            </span>
            <span className="text-xs text-slate-400">SKU: {product.sku || 'BC-001'}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
            {product.name}
          </h1>

          {/* Rating / Stock Status */}
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF7F1] text-emerald-900">
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
            <span className="text-xs text-slate-400">• Certified Baby Safe</span>
          </div>
        </div>

        {/* Price display */}
        <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white border border-emerald-50">
          <span className="font-heading text-3xl font-bold text-slate-900">
            ₹{price}
          </span>
          {hasDiscount && (
            <span className="text-base text-slate-400 line-through">
              ₹{product.price}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Save ₹{product.price - product.sale_price!}
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Select Size
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    selectedSize === s
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    selectedColor === c
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Stepper */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quantity
          </label>
          <div className="inline-flex items-center border border-slate-200 bg-white rounded-full p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-sm text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                addedAnimation
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-lg'
              } disabled:opacity-50`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 text-emerald-200" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Bag • ₹{price * quantity}</span>
                </>
              )}
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() =>
                toggleWishlist({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  salePrice: product.sale_price,
                  image: activeImage,
                  categoryName: product.category?.name,
                  inStock: product.stock > 0,
                })
              }
              className={`p-4 rounded-full border transition-all ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Quick WhatsApp Order Button */}
          <button
            onClick={handleWhatsAppQuickOrder}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BE5B] text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Order Instantly on WhatsApp</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-emerald-100 text-center text-slate-600">
          <div className="p-2">
            <Truck className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">Free Delivery &gt; ₹999</p>
          </div>
          <div className="p-2">
            <ShieldCheck className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">100% Organic Safe</p>
          </div>
          <div className="p-2">
            <RotateCcw className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">Easy 7-Day Exchange</p>
          </div>
        </div>

      </div>

    </div>
  );
}
