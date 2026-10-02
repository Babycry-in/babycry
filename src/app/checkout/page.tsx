'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';
import { ShieldCheck, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Pandikkad',
    state: 'Kerala',
    pincode: '',
    deliveryInstructions: '',
  });

  const freeShippingThreshold = 999;
  const deliveryFee = subtotal >= freeShippingThreshold ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!form.name || !form.phone || !form.address || !form.pincode) {
      setErrorMessage('Please fill in all required delivery details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || `${form.phone}@babycry.in`,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          delivery_instructions: form.deliveryInstructions,
          items: items.map((it) => ({
            productId: it.productId,
            variant: `${it.selectedSize || ''} ${it.selectedColor || ''}`.trim() || 'Standard',
            quantity: it.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // If WhatsApp deep-link exists, open it and store it
      if (data.whatsappUrl) {
        sessionStorage.setItem('babycry_last_whatsapp_url', data.whatsappUrl);
        window.open(data.whatsappUrl, '_blank');
      }

      clearCart();
      router.push(`/order-success/${data.order.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-20 text-center px-4">
        <h2 className="font-heading text-2xl font-bold text-slate-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Add some cute baby pieces before checking out.
        </p>
        <Link
          href="/categories"
          className="px-6 py-3 bg-emerald-700 text-white rounded-full font-medium text-sm"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Checkout & WhatsApp Order
        </h1>

        {errorMessage && (
          <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Delivery Address Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                1. Delivery Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Where should we send your little bundle of joy?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Nair"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. ananya@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Street Address & House / Flat No. *
                </label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Rose Villa, Near Town Hall, Kanjirapadi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="676521"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="deliveryInstructions"
                  value={form.deliveryInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Leave with security, baby sleeping ring bell softly"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                2. Payment Method
              </h3>
              <div className="p-4 rounded-2xl bg-[#EBF7F1] border border-emerald-200 flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-emerald-950">
                    WhatsApp Order & Cash On Delivery / UPI
                  </p>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    Your order will be instantly saved in our system and confirmed with Baby Cry.in via WhatsApp. Pay conveniently on delivery or through UPI!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Review & Confirmation */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
            <h2 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const unit = item.salePrice || item.price;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-slate-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      ₹{unit * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                <span className="font-heading font-bold text-base text-slate-900">
                  Total Payable
                </span>
                <span className="font-heading font-bold text-2xl text-emerald-900">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Order...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  <span>Confirm Order via WhatsApp</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safe 256-Bit Encrypted & Verified Order</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
