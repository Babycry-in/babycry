'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
  Check,
  Ban,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
}

// Helper to determine or normalize variant category/type
function getVariantType(v: ProductVariant): string {
  // If title has encoded prefix like "[Volume] 50 ml"
  const prefixMatch = (v.title || '').match(/^\[([A-Za-z]+)\]\s*(.*)$/);
  if (prefixMatch) {
    return prefixMatch[1];
  }

  if (v.variant_type && v.variant_type !== 'Option' && v.variant_type !== 'Custom') {
    return v.variant_type;
  }
  if (v.color) return 'Color';

  const val = (v.variant_value || v.size || v.title || '').trim().toLowerCase();
  if (/\b\d+\s*(ml|l|litre|liter|litres|liters)\b/i.test(val)) {
    return 'Volume';
  }
  if (/\b\d+\s*(g|gm|gms|kg|kgs|gram|grams)\b/i.test(val)) {
    return 'Weight';
  }
  if (/\b(fabric|cotton|muslin|linen|bamboo|wool|silicone|leather|polyester|denim|modal|fleece|satin|wood)\b/i.test(val)) {
    return 'Material';
  }
  const commonColors = ['red', 'blue', 'green', 'white', 'black', 'pink', 'yellow', 'mint', 'cream', 'peach', 'grey', 'gray', 'beige', 'navy', 'brown', 'purple', 'orange'];
  if (commonColors.some(c => val.includes(c))) {
    return 'Color';
  }
  if (/^(newborn|nb|\d+-\d+\s*m|\d+\s*m|\d+-\d+\s*y|\d+\s*y|xs|s|m|l|xl|xxl|free\s*size)$/i.test(val) || /month|year|size/i.test(val)) {
    return 'Size';
  }
  if (v.size) return 'Size';
  return v.variant_type || 'Size';
}

export function ProductDetailClient({ product, whatsappNumber: _whatsappNumber }: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'placeholder', cloudinary_url: '/images/babycry-logo.png', is_primary: true, sort_order: 0 }];

  const [activeImage, setActiveImage] = useState(images[0]?.cloudinary_url);

  // Categorize product variants and legacy sizes/colors into distinct attribute groups
  const attributeGroups = useMemo(() => {
    const map = new Map<string, { label: string; values: string[] }>();
    const hasDynamicVariants = Boolean(product.variants && product.variants.length > 0);

    // 1. If product has dynamic variants, they are the sole source of truth
    if (hasDynamicVariants) {
      product.variants!.forEach((v) => {
        const type = getVariantType(v);
        let val = (v.variant_value || v.title || v.size || v.color || '').trim();
        const prefixMatch = val.match(/^\[([A-Za-z]+)\]\s*(.*)$/);
        if (prefixMatch) {
          val = prefixMatch[2] || val;
        }
        if (!val) return;

        let label = 'SELECT OPTION';
        if (type === 'Size') label = 'SELECT SIZE';
        else if (type === 'Color') label = 'COLOR';
        else if (type === 'Volume') label = 'SELECT VOLUME';
        else if (type === 'Weight') label = 'SELECT WEIGHT';
        else if (type === 'Material') label = 'MATERIAL';
        else label = `SELECT ${type.toUpperCase()}`;

        if (!map.has(type)) {
          map.set(type, { label, values: [] });
        }
        const grp = map.get(type)!;
        if (!grp.values.includes(val)) {
          grp.values.push(val);
        }
      });
    } else {
      // 2. Fallback to legacy sizes ONLY if no dynamic variants exist
      if (product.sizes && product.sizes.length > 0) {
        map.set('Size', {
          label: 'SELECT SIZE',
          values: Array.from(new Set(product.sizes)),
        });
      }

      // 3. Fallback to legacy colors ONLY if no dynamic variants exist
      if (product.colors && product.colors.length > 0) {
        map.set('Color', {
          label: 'COLOR',
          values: Array.from(new Set(product.colors)),
        });
      }
    }

    return Array.from(map.entries()).map(([type, data]) => ({
      type,
      label: data.label,
      values: data.values,
    }));
  }, [product.variants, product.sizes, product.colors]);

  // Track selection for each attribute group
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    attributeGroups.forEach((g) => {
      if (g.values.length > 0) {
        initial[g.type] = g.values[0];
      }
    });
    return initial;
  });

  const handleSelectAttribute = (type: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  // Helper to match the active variant based on selected attributes
  const matchedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;

    const selectedEntries = Object.entries(selectedAttributes).filter(([_, val]) => Boolean(val));
    if (selectedEntries.length === 0) return product.variants[0] || null;

    // 1. Single attribute match (Size, Volume, Weight, Color, Material, Custom)
    if (selectedEntries.length === 1) {
      const [selType, selVal] = selectedEntries[0];
      const found = product.variants.find((v) => {
        const type = getVariantType(v);
        const val = (v.variant_value || v.size || v.color || v.title || '')
          .replace(/^\[[A-Za-z]+\]\s*/, '')
          .trim();
        return (
          (type.toLowerCase() === selType.toLowerCase() || selType.toLowerCase() === 'custom') &&
          val.toLowerCase() === selVal.toLowerCase()
        );
      });
      if (found) return found;
    }

    // 2. Combination match where all selected values are included
    const foundMulti = product.variants.find((v) => {
      const vVal = (v.variant_value || v.size || v.color || v.title || '').toLowerCase();
      return selectedEntries.every(([_, val]) => vVal.includes(val.toLowerCase()));
    });
    if (foundMulti) return foundMulti;

    // 3. Fallback: match any selected attribute value
    const foundAny = product.variants.find((v) => {
      const vVal = (v.variant_value || v.size || v.color || v.title || '').toLowerCase();
      return selectedEntries.some(([_, val]) => vVal === val.toLowerCase());
    });

    return foundAny || product.variants[0] || null;
  }, [product.variants, selectedAttributes]);


  // Price calculations: Admin-assigned variant price takes precedence
  const hasVariantPrice = Boolean(
    matchedVariant?.price != null && !isNaN(matchedVariant.price) && matchedVariant.price > 0
  );
  const unitPrice = hasVariantPrice
    ? matchedVariant!.price!
    : (product.sale_price || product.price);
  const originalPrice = hasVariantPrice
    ? (product.price > unitPrice ? product.price : unitPrice)
    : product.price;
  const hasDiscount = Boolean(
    !hasVariantPrice && product.sale_price && product.sale_price < product.price
  );
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
    : 0;

  // Stock check
  const activeStock = (matchedVariant?.stock !== undefined && matchedVariant.stock > 0)
    ? matchedVariant.stock
    : product.stock;
  const isOutOfStock = product.stock <= 0 || product.stock_status === 'out_of_stock' || activeStock <= 0;
  const isLimitedStock = !isOutOfStock && (activeStock <= 5 || product.stock_status === 'limited_stock');

  const activeIndex = Math.max(
    0,
    images.findIndex((img) => img.cloudinary_url === activeImage)
  );

  // Formatted variant summary string (e.g. "0-6M / Blue" or "50 ml")
  const selectedVariantSummary = useMemo(() => {
    const parts = Object.values(selectedAttributes).filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : undefined;
  }, [selectedAttributes]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: unitPrice,
      salePrice: null,
      image: activeImage,
      quantity,
      selectedSize: selectedAttributes['Size'],
      selectedColor: selectedAttributes['Color'],
      selectedVariantId: matchedVariant?.id,
      selectedVariantTitle: selectedVariantSummary,
      maxStock: activeStock,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Order via WhatsApp
  const handleOrderViaWhatsApp = () => {
    if (isOutOfStock) return;

    const params = new URLSearchParams({ qty: String(quantity) });
    if (selectedVariantSummary) {
      params.set('variant', selectedVariantSummary);
    }
    if (selectedAttributes['Size']) {
      params.set('size', selectedAttributes['Size']);
    }
    if (selectedAttributes['Color']) {
      params.set('color', selectedAttributes['Color']);
    }
    if (unitPrice) {
      params.set('price', String(unitPrice));
    }
    router.push(`/order/${product.slug}?${params.toString()}`);
  };

  return (
    // pb-28 on mobile leaves room for the sticky action bar; sm:pb-0 keeps desktop unchanged
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-14 items-start pb-8 sm:pb-0">

      {/* LEFT: Product Gallery - Sticky on Desktop to prevent gap */}
      <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:sticky lg:top-24 lg:self-start">
        {/* Main Big View */}
        <div className="relative aspect-square w-full max-w-[460px] sm:max-h-[580px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xs border border-emerald-100/70">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 650px"
            className={`object-contain p-2 sm:p-6 transition-all duration-300 ${isOutOfStock ? 'opacity-55 grayscale-[40%]' : ''
              }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 z-10">
            {product.is_new && !isOutOfStock && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#B9E6D3] text-[#1A5741] text-[10px] sm:text-xs font-bold uppercase rounded-full shadow-2xs">
                New Arrival
              </span>
            )}
            {hasDiscount && !isOutOfStock && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#FFE5D9] text-[#C44D25] text-[10px] sm:text-xs font-bold rounded-full shadow-2xs">
                {discountPercent}% OFF
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1 bg-rose-600 text-white text-[11px] sm:text-xs font-extrabold uppercase rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Out of Stock Centered Overlay Banner */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-3 bg-black/20 backdrop-blur-[1.5px] pointer-events-none">
              <div className="bg-black/80 text-white px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Out of Stock
                </span>
              </div>
            </div>
          )}

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
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 bg-white transition-all shrink-0 cursor-pointer snap-start ${activeImage === img.cloudinary_url
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

      {/* RIGHT: Product Details & Purchase Actions (Scrollable) */}
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
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${isOutOfStock
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : isLimitedStock
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-[#EBF7F1] text-emerald-900 border border-emerald-100'
                }`}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : isLimitedStock
                  ? `Limited Stock (Only ${product.stock} left!)`
                  : `In Stock (${product.stock} available)`}
            </span>
            <span className="inline-flex items-center text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              • Certified Baby Safe
            </span>
          </div>
        </div>

        {/* Price display */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs">
          <span className="font-heading text-[28px] sm:text-3xl font-bold text-slate-900 leading-none">
            ₹{unitPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm sm:text-base text-slate-400 line-through">
              ₹{originalPrice}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-[#EBF7F1] border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              Save ₹{originalPrice - unitPrice} ({discountPercent}% OFF)
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Variant Groups: Exact match to reference screenshot with Selected indicator and rounded-2xl buttons */}
        {attributeGroups.length > 0 && (
          <div className="space-y-4 pt-1">
            {attributeGroups.map((group) => {
              const currentSelected = selectedAttributes[group.type] || group.values[0];

              return (
                <div key={group.type} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold uppercase tracking-wider text-slate-600 text-[11px] sm:text-xs">
                      {group.label}
                    </label>
                    {currentSelected && (
                      <span className="text-[11px] sm:text-xs text-emerald-800 font-medium">
                        Selected: {currentSelected}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {group.values.map((val) => {
                      const isSelected = selectedAttributes[group.type] === val;

                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelectAttribute(group.type, val)}
                          className={`min-h-[42px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer inline-flex items-center justify-center ${isSelected
                              ? 'bg-[#1A5741] text-white border-[#1A5741] shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                        >
                          <span>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quantity Stepper */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between sm:block sm:space-y-2 pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quantity
            </label>
            <div className="inline-flex items-center border border-slate-200 bg-white rounded-full p-1">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center font-semibold text-sm text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= product.stock}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons — Tablet & Desktop */}
        <div className="hidden sm:block space-y-2.5 sm:space-y-3 pt-2">
          {isOutOfStock ? (
            <div className="w-full py-4 px-6 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-center text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs">
              <Ban className="w-5 h-5 text-rose-600" />
              <span>OUT OF STOCK</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3.5 sm:py-4 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${addedAnimation
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white hover:shadow-md'
                  }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add to Bag • ₹{unitPrice * quantity}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOrderViaWhatsApp}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BE5B] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Order via WhatsApp</span>
              </button>
            </>
          )}
        </div>

        {/* Trust Badges - (Free Delivery removed per request) */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-100 text-center text-slate-600">
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

      {/* MOBILE ONLY: Sticky bottom action bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        {isOutOfStock ? (
          <div className="h-12 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <Ban className="w-4 h-4 text-rose-600" />
            <span>Out of Stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-12 px-3 rounded-full font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-sm text-white cursor-pointer ${addedAnimation ? 'bg-emerald-800' : 'bg-emerald-700 active:scale-[0.98]'
                }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add • ₹{unitPrice * quantity}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOrderViaWhatsApp}
              className="flex-1 h-12 px-3 bg-[#25D366] active:scale-[0.98] text-white font-semibold text-[13px] rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}