'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { Heart, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = React.useState(false);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.cloudinary_url ||
    product.images?.[0]?.cloudinary_url ||
    '/images/babycry-logo.png';

  const inWishlist = isInWishlist(product.id);
  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: primaryImage,
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0],
      maxStock: product.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.sale_price,
      image: primaryImage,
      categoryName: product.category?.name,
      inStock: product.stock > 0,
    });
  };

  return (
    <div
      style={{ backgroundColor: '#ffffff' }}
      className="group relative flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image area — white background, full-width fill */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full"
        style={{ paddingBottom: '110%', backgroundColor: '#ffffff' }}
      >
        {/* mix-blend-multiply + brightness-110 turns white / very light gray
            image backgrounds (like #E8E8E8) into pure white.
            Remove `brightness-110` if product colors look too bright. */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ backgroundColor: '#ffffff' }}
          className="object-contain object-center p-3 sm:p-4 mix-blend-multiply brightness-110 group-hover:scale-105 transition-transform duration-500"
        />

        {/* NEW badge — top left */}
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-[#5BAF91] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm z-10">
            NEW
          </span>
        )}

        {/* Wishlist Heart — top right */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm transition-colors z-10 hover:bg-white"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              inWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'
            }`}
          />
        </button>
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
            <span className="font-heading font-bold text-slate-900 text-sm sm:text-base">
              ₹{price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
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
        </div>
      </div>
    </div>
  );
}