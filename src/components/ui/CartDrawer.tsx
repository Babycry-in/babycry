'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-white/90">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="font-heading text-xl font-semibold text-slate-800">
                Your Little Bag
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="px-5 py-3 bg-[#EBF7F1] border-b border-emerald-100">
            <div className="text-xs font-medium text-emerald-800 mb-1 flex justify-between">
              <span>
                {amountToFreeShipping > 0
                  ? `Add ₹${amountToFreeShipping} more for FREE Delivery! 🚚`
                  : '🎉 Congratulations! You have unlocked FREE Delivery!'}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-lg text-slate-800 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Little smiles are waiting! Explore our cute outfits, essentials and gift hampers.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-full font-medium text-sm hover:bg-emerald-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.salePrice || item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white rounded-2xl border border-emerald-50 shadow-xs"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-emerald-50 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-slate-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.selectedSize && `Size: ${item.selectedSize} `}
                        {item.selectedColor && `• Color: ${item.selectedColor}`}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold text-emerald-800 text-sm">
                          ₹{price * item.quantity}
                        </span>
                        <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-emerald-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-emerald-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-emerald-100 bg-white/95 space-y-3">
              <div className="flex justify-between items-center text-slate-600 text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 text-base">₹{subtotal}</span>
              </div>
              <p className="text-xs text-slate-400">
                Taxes and delivery calculated securely at checkout.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3.5 bg-emerald-700 text-white font-medium rounded-full text-center hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
