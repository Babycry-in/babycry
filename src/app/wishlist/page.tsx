'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCart } from '@/lib/context/cart-context';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Heart className="w-5 h-5 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Your Saved Loves</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            My Wishlist ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-800 mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Tap the little heart on any product to save it here for later.
            </p>
            <Link
              href="/categories"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => {
              const price = item.salePrice || item.price;
              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-50 shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="250px"
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xs transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-emerald-800/70 tracking-wide uppercase">
                      {item.categoryName || 'Baby Cry'}
                    </span>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-heading font-semibold text-slate-800 text-sm hover:text-emerald-700 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-heading font-bold text-slate-900 text-base">
                        ₹{price}
                      </span>
                      {item.salePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        addToCart({
                          productId: item.productId,
                          name: item.name,
                          slug: item.slug,
                          price: item.price,
                          salePrice: item.salePrice,
                          image: item.image,
                          quantity: 1,
                          maxStock: 20,
                        });
                        removeFromWishlist(item.productId);
                      }}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white rounded-full font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
