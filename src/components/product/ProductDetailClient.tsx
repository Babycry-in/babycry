'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import {
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

export function ProductDetailClient({ product, whatsappNumber: _whatsappNumber }: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'placeholder', cloudinary_url: '/images/babycry-logo.png', is_primary: true, sort_order: 0 }];

  const [activeImage, setActiveImage] = useState(images[0]?.cloudinary_url);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const activeIndex = Math.max(
    0,
    images.findIndex((img) => img.cloudinary_url === activeImage)
  );

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

  // Navigate to order details page — do NOT open WhatsApp directly
  const handleOrderViaWhatsApp = () => {
    const params = new URLSearchParams({ qty: String(quantity) });
    if (selectedSize) params.set('size', selectedSize);
    if (selectedColor) params.set('color', selectedColor);
    router.push(`/order/${product.slug}?${params.toString()}`);
  };

  return (
    // pb-28 on mobile leaves room for the sticky action bar; sm:pb-0 keeps desktop unchanged
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-14 items-start pb-28 sm:pb-0">

      {/* LEFT: Product Gallery */}
      <div className="lg:col-span-7 space-y-3 sm:space-y-4">
        {/* Main Big View */}
        <div className="relative aspect-square w-full max-w-[460px] sm:max-h-[580px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xs border border-emerald-100/70">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-contain p-2 sm:p-6"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 z-10">
            {product.is_new && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#B9E6D3] text-[#1A5741] text-[10px] sm:text-xs font-bold uppercase rounded-full shadow-2xs">
                New Arrival
              </span>
            )}
            {hasDiscount && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#FFE5D9] text-[#C44D25] text-[10px] sm:text-xs font-bold rounded-full shadow-2xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Mobile-only image counter */}
          {images.length > 1 && (
            <span className="sm:hidden absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory sm:snap-none">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(img.cloudinary_url)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 bg-white transition-all shrink-0 cursor-pointer snap-start ${
                  activeImage === img.cloudinary_url
                    ? 'border-emerald-600 scale-105 shadow-xs'
                    : 'border-slate-100 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.cloudinary_url}
                  alt={img.alt_text || product.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Details & Purchase Actions */}
      <div className="lg:col-span-5 space-y-4 sm:space-y-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800">
              {product.category?.name || product.brand || 'Baby Cry'}
            </span>
            {product.sku && (
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <h1 className="font-heading text-[22px] sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight sm:leading-snug">
            {product.name}
          </h1>

          {/* Rating / Stock Status */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
                product.stock > 0
                  ? 'bg-[#EBF7F1] text-emerald-900 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
            <span className="inline-flex items-center text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              • Certified Baby Safe
            </span>
          </div>
        </div>

        {/* Price display */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <span className="font-heading text-[28px] sm:text-3xl font-bold text-slate-900 leading-none">
            ₹{price}
          </span>
          {hasDiscount && (
            <span className="text-sm sm:text-base text-slate-400 line-through">
              ₹{product.price}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-[#EBF7F1] border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              Save ₹{product.price - product.sale_price!} ({discountPercent}% OFF)
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
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
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`min-h-[44px] sm:min-h-[40px] min-w-[48px] sm:min-w-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
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
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`min-h-[44px] sm:min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    selectedColor === c
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Stepper (label left / stepper right on mobile, stacked on sm+) */}
        <div className="flex items-center justify-between sm:block sm:space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quantity
          </label>
          <div className="inline-flex items-center border border-slate-200 bg-white rounded-full p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold active:scale-95 transition-all cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-sm text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold active:scale-95 transition-all cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons — tablet/desktop only (mobile uses the sticky bar below) */}
        <div className="hidden sm:block space-y-2.5 sm:space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              addedAnimation
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white hover:shadow-md'
            } disabled:opacity-50 cursor-pointer`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add to Bag • ₹{price * quantity}</span>
              </>
            )}
          </button>

          {/* Order via WhatsApp Button */}
          <button
            type="button"
            onClick={handleOrderViaWhatsApp}
            disabled={product.stock <= 0}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BE5B] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Order via WhatsApp</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-emerald-100 text-center text-slate-600">
          <div className="p-2.5 sm:p-2 rounded-xl bg-emerald-50/60 sm:bg-transparent">
            <Truck className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">Free Delivery &gt; ₹999</p>
          </div>
          <div className="p-2.5 sm:p-2 rounded-xl bg-emerald-50/60 sm:bg-transparent">
            <ShieldCheck className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">100% Organic Safe</p>
          </div>
          <div className="p-2.5 sm:p-2 rounded-xl bg-emerald-50/60 sm:bg-transparent">
            <RotateCcw className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
            <p className="text-[11px] font-medium leading-tight">Easy 7-Day Exchange</p>
          </div>
        </div>

      </div>

      {/* MOBILE ONLY: Sticky bottom action bar (same handlers as the desktop buttons) */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 h-12 px-3 rounded-full font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-sm text-white ${
              addedAnimation ? 'bg-emerald-800' : 'bg-emerald-700 active:scale-[0.98]'
            } disabled:opacity-50 cursor-pointer`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ₹{price * quantity}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOrderViaWhatsApp}
            disabled={product.stock <= 0}
            className="flex-1 h-12 px-3 bg-[#25D366] active:scale-[0.98] text-white font-semibold text-[13px] rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
}