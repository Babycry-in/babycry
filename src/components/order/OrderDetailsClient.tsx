'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import {
  generateWhatsAppChatUrl,
  buildWhatsAppCustomerOrderMessage,
} from '@/lib/whatsapp/message-formatter';
import {
  ShieldCheck,
  MessageCircle,
  Loader2,
  ArrowLeft,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface OrderDetailsClientProps {
  product: Product | null;
  isCart?: boolean;
  whatsappNumber: string;
  initialQty?: number;
  initialSize?: string;
  initialColor?: string;
}

export default function OrderDetailsClient({
  product,
  isCart = false,
  whatsappNumber,
  initialQty = 1,
  initialSize,
  initialColor,
}: OrderDetailsClientProps) {
  const router = useRouter();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();

  // Single-product local state
  const [quantity, setQuantity] = useState(
    Math.max(1, Math.min(initialQty || 1, product?.stock || 99))
  );

  // Customer details form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    location?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Calculations
  const freeShippingThreshold = 999;
  
  // Single product calculations
  const singleUnitPrice = product ? (product.sale_price || product.price) : 0;
  const singleSubtotal = singleUnitPrice * quantity;
  const singleDeliveryFee = singleSubtotal >= freeShippingThreshold ? 0 : 99;
  const singleTotal = singleSubtotal + singleDeliveryFee;

  // Cart calculations
  const cartDeliveryFee = cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  const activeSubtotal = isCart ? cartSubtotal : singleSubtotal;
  const activeDeliveryFee = isCart ? cartDeliveryFee : singleDeliveryFee;
  const activeTotal = isCart ? cartTotal : singleTotal;

  const primaryProductImage =
    product?.images?.find((i) => i.is_primary)?.cloudinary_url ||
    product?.images?.[0]?.cloudinary_url ||
    '/images/babycry-logo.png';

  const variantLabel = [initialSize, initialColor].filter(Boolean).join(' / ') || 'Standard';

  const validate = () => {
    const newErrors: { name?: string; phone?: string; location?: string } = {};

    if (!form.name.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your mobile number';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!form.location.trim()) {
      newErrors.location = 'Please enter your delivery location / address';
    } else if (form.location.trim().length < 5) {
      newErrors.location = 'Please provide full delivery address or location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    if (isCart && cartItems.length === 0) {
      setSubmitError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!isCart && !product) {
      setSubmitError('Product details could not be found.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare items snapshot
      const orderItems = isCart
        ? cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            variant: [item.selectedSize, item.selectedColor].filter(Boolean).join(' / ') || 'Standard',
            quantity: item.quantity,
            price: item.salePrice || item.price,
          }))
        : [
            {
              productId: product!.id,
              name: product!.name,
              variant: variantLabel,
              quantity,
              price: singleUnitPrice,
            },
          ];

      // 2. Build WhatsApp Message
      const whatsappMessage = buildWhatsAppCustomerOrderMessage({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerLocation: form.location.trim(),
        items: orderItems,
        total: activeTotal,
      });

      const chatUrl = generateWhatsAppChatUrl(
        whatsappNumber || '8136819192',
        whatsappMessage
      );

      // 3. Try to save order in the backend
      let orderNumber = `BC-${Date.now().toString().slice(-6)}`;
      try {
        const orderRes = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: form.name.trim(),
            customer_phone: form.phone.trim(),
            customer_email: `${form.phone.trim()}@babycry.in`,
            address: form.location.trim(),
            city: form.city.trim() || 'Pandikkad',
            state: 'Kerala',
            pincode: form.pincode.trim() || '676521',
            items: orderItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              variant: item.variant,
              quantity: item.quantity,
            })),
          }),
        });

        if (orderRes.ok) {
          const resData = await orderRes.json();
          if (resData.order?.order_number) {
            orderNumber = resData.order.order_number;
          }
        } else {
          const errData = await orderRes.json().catch(() => ({}));
          console.error('Backend order recording error:', errData);
          throw new Error(errData.error || 'Failed to place order. Please check details and try again.');
        }
      } catch (err: any) {
        console.error('Order creation error:', err);
        setSubmitError(err.message || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // 4. Save last WhatsApp URL in session storage and open WhatsApp
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('babycry_last_whatsapp_url', chatUrl);
        window.open(chatUrl, '_blank');
      }

      // 5. Clean cart if ordering from cart
      if (isCart) {
        clearCart();
      }

      // 6. Navigate to order confirmation
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // If cart mode and cart is empty
  if (isCart && cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center shadow-xs border border-emerald-100/50">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Looks like you haven&apos;t added any baby essentials yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-800 text-white font-medium text-sm rounded-full hover:bg-emerald-900 transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link / Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={isCart ? '/cart' : product ? `/products/${product.slug}` : '/'}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isCart ? 'Back to Cart' : 'Back to Product'}</span>
          </Link>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified WhatsApp Checkout
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Customer Details Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100/60">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Order via WhatsApp
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  Delivery Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your information below to continue to WhatsApp and confirm your order.
                </p>
              </div>

              {submitError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-[#FAF7F2]/50 border rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${
                      errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3.5 py-3 rounded-l-2xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      maxLength={10}
                      inputMode="numeric"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 bg-[#FAF7F2]/50 border rounded-r-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${
                        errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.phone}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    This phone number will be used for delivery updates on WhatsApp.
                  </p>
                </div>

                {/* Location / Delivery Address */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Location / Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="location"
                    name="location"
                    rows={3}
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="House / Flat name, street address, locality & landmark"
                    className={`w-full px-4 py-3 bg-[#FAF7F2]/50 border rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all ${
                      errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.location}</p>
                  )}
                </div>

                {/* Town / City & Pincode */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      City / Town
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="Enter city / town"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2]/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Pincode
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit pincode"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2]/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20BE5B] text-white font-semibold text-sm sm:text-base rounded-full flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                        <span>Continue to WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] sm:text-xs text-slate-400 mt-2.5">
                    WhatsApp will open with your pre-filled order details ready to send.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/60 sticky top-24">
              <h2 className="font-heading text-lg font-bold text-slate-900 pb-3 border-b border-emerald-50">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="divide-y divide-emerald-50/70 max-h-80 overflow-y-auto">
                {isCart ? (
                  cartItems.map((item) => (
                    <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="py-3.5 flex gap-3.5 items-center">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-emerald-100/40">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-xs sm:text-sm text-slate-800 truncate">
                          {item.name}
                        </h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-[11px] text-slate-400">
                            {[item.selectedSize, item.selectedColor].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          Qty: {item.quantity} × ₹{item.salePrice || item.price}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-heading font-bold text-sm text-slate-900">
                          ₹{(item.salePrice || item.price) * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : product ? (
                  <div className="py-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-emerald-100/40">
                        <Image
                          src={primaryProductImage}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-sm text-slate-900 truncate">
                          {product.name}
                        </h3>
                        {variantLabel !== 'Standard' && (
                          <p className="text-xs text-emerald-800 font-medium mt-0.5">
                            {variantLabel}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          Price: ₹{singleUnitPrice}
                        </p>

                        {/* Quantity Counter for Single Product */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-400">Qty:</span>
                          <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-50">
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              disabled={quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-emerald-800 disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-2 min-w-[20px] text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity((q) => Math.min(product.stock || 99, q + 1))
                              }
                              disabled={quantity >= (product.stock || 99)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-emerald-800 disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-emerald-50 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{activeSubtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    Delivery Charges
                  </span>
                  <span className="font-semibold text-slate-800">
                    {activeDeliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${activeDeliveryFee}`
                    )}
                  </span>
                </div>

                {activeSubtotal < freeShippingThreshold && (
                  <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-xl">
                    Add ₹{freeShippingThreshold - activeSubtotal} more for FREE Delivery!
                  </p>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-emerald-50 text-slate-900">
                  <span className="font-heading font-bold text-sm sm:text-base">
                    Total Amount
                  </span>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-emerald-900">
                    ₹{activeTotal}
                  </span>
                </div>
              </div>

              {/* Trust Pillars Mini */}
              <div className="mt-5 pt-4 border-t border-emerald-50/80 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Secure direct order with store owner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery / UPI upon receipt</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
