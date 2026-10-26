'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import { ShoppingBag, Check, Ban } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

function ProductCardInner({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.cloudinary_url ||
    product.images?.[0]?.cloudinary_url ||
    '/images/babycry-logo.png';

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  // Determine Out of Stock and Limited Stock states
  const isOutOfStock = product.stock <= 0 || product.stock_status === 'out_of_stock';
  const isLimitedStock = !isOutOfStock && (product.stock_status === 'limited_stock' || (product.stock > 0 && product.stock <= 5));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // Pick first variant if present
    const firstVariant = product.variants?.[0];

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: firstVariant?.price || product.price,
      salePrice: firstVariant?.price ? null : product.sale_price,
      image: primaryImage,
      quantity: 1,
      selectedSize: firstVariant?.size || product.sizes?.[0],
      selectedColor: firstVariant?.color || product.colors?.[0],
      selectedVariantId: firstVariant?.id,
      selectedVariantTitle: firstVariant?.title,
      maxStock: firstVariant?.stock ?? product.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      style={{ backgroundColor: '#ffffff' }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        isOutOfStock ? 'opacity-85' : ''
      }`}
    >
      {/* Image area — white background, full-width fill */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full overflow-hidden"
        style={{ paddingBottom: '110%', backgroundColor: '#ffffff' }}
      >
        {/* mix-blend-multiply + brightness-110 turns white / very light gray image backgrounds into pure white.
            If product is out of stock, apply elegant fade-out filter */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ backgroundColor: '#ffffff' }}
          className={`object-contain object-center p-3 sm:p-4 mix-blend-multiply brightness-110 transition-all duration-500 ${
            isOutOfStock
              ? 'opacity-55 grayscale-[40%] scale-100'
              : 'group-hover:scale-105'
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.is_new && !isOutOfStock && (
            <span className="bg-[#5BAF91] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {isLimitedStock && (
            <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full shadow-sm">
              Few Left
            </span>
          )}
        </div>

        {/* High-visibility Out of Stock Overlay Banner — Not just an icon, full responsive banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-3 bg-black/20 backdrop-blur-[1.5px] pointer-events-none">
            <div className="bg-black/75 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white">
                Out of Stock
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Text area — category label, name, price, add to cart */}
      <div className="px-3 pt-3 pb-4 flex flex-col gap-1 bg-white">
        <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700/80 tracking-wide uppercase">
          {product.category?.name || product.brand || 'Baby Cry'}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading font-semibold text-slate-800 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-700 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-1.5">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className={`font-heading font-bold text-sm sm:text-base ${isOutOfStock ? 'text-slate-500' : 'text-slate-900'}`}>
              ₹{price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Add to cart / Out of stock button */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 cursor-not-allowed opacity-80"
              aria-label="Out of stock"
              title="Out of stock"
            >
              <Ban className="w-4 h-4 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#EBF7F1] text-emerald-800 hover:bg-emerald-600 hover:text-white'
              }`}
              aria-label="Add to cart"
              title="Add to cart"
            >
              {justAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProductCard = React.memo(ProductCardInner);