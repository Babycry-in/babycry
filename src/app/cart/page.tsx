'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const deliveryFee = subtotal >= freeShippingThreshold ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Shopping Bag ({itemCount})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-800 mb-1">
              Your bag is empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Looks like you haven&apos;t added any little favorites yet!
            </p>
            <Link
              href="/categories"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery prompt banner */}
              <div className="p-4 bg-[#EBF7F1] rounded-2xl border border-emerald-200/60">
                <div className="text-xs font-medium text-emerald-800 mb-1.5 flex justify-between">
                  <span>
                    {amountToFreeShipping > 0
                      ? `Add ₹${amountToFreeShipping} more to enjoy FREE Delivery!`
                      : '🎉 You have unlocked FREE Delivery!'}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {items.map((item) => {
                const unitPrice = item.salePrice || item.price;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-3xl border border-emerald-50 shadow-xs gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-heading font-semibold text-slate-800 text-sm sm:text-base hover:text-emerald-700 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.selectedSize && `Size: ${item.selectedSize} `}
                          {item.selectedColor && `• Color: ${item.selectedColor}`}
                        </p>
                        <span className="font-bold text-sm text-emerald-800 sm:hidden block mt-1">
                          ₹{unitPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-emerald-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-emerald-700"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                          ₹{unitPrice * item.quantity}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-sm text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-heading font-bold text-base text-slate-900">
                  Total Amount
                </span>
                <span className="font-heading font-bold text-2xl text-emerald-900">
                  ₹{grandTotal}
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/order/cart?source=cart"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20BE5B] text-white font-semibold text-sm rounded-full text-center flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified WhatsApp & Cash on Delivery</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
