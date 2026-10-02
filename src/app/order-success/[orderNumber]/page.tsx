'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  MessageCircle,
  ShoppingBag,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Order } from '@/types/database';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [storedWhatsAppUrl, setStoredWhatsAppUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fire festive baby confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4E8A73', '#F58220', '#1FA353', '#B9E6D3', '#FEF3C7'],
      });
    } catch {}

    // Check stored WhatsApp URL
    const lastUrl = sessionStorage.getItem('babycry_last_whatsapp_url');
    if (lastUrl) {
      setStoredWhatsAppUrl(lastUrl);
    }

    // Fetch order from API
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-[40px] p-6 sm:p-10 border border-emerald-100 shadow-lg text-center space-y-6">
          
          <div className="w-20 h-20 rounded-full bg-[#EBF7F1] text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ORDER PLACED SUCCESSFULLY</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
              Thank You for Shopping with Baby Cry.in!
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md mx-auto">
              Your order <span className="font-bold text-emerald-800">#{orderNumber}</span> has been saved and is being prepared with utmost care.
            </p>
          </div>

          {/* Action WhatsApp Trigger */}
          {storedWhatsAppUrl && (
            <div className="p-5 bg-gradient-to-r from-[#EBF7F1] to-[#D5EDE3] rounded-3xl border border-emerald-200 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-heading font-bold text-emerald-950 text-base">
                  Connect on WhatsApp
                </p>
                <p className="text-xs text-emerald-800">
                  Click below to open WhatsApp with your pre-formatted order details and instant updates!
                </p>
              </div>
              <a
                href={storedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] hover:bg-[#20BE5B] text-white font-bold text-xs sm:text-sm rounded-full inline-flex items-center gap-2 shadow-md transition-transform hover:scale-105 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          )}

          {/* Order Details Breakdown */}
          {order && (
            <div className="text-left border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-heading text-lg font-bold text-slate-800">
                Order Summary
              </h3>

              <div className="space-y-3">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">{it.product_name_snapshot}</p>
                      <p className="text-xs text-slate-400">
                        Qty: {it.quantity} {it.variant_snapshot && `• ${it.variant_snapshot}`}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-800">₹{it.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-sm text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Paid / Payable</span>
                  <span className="text-emerald-900 font-heading text-xl">₹{order.total}</span>
                </div>
              </div>

              {/* Delivery Address snippet */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-emerald-50 text-xs text-slate-600 flex items-start gap-2.5 mt-4">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">
                    Delivery to: {order.customer_name} ({order.customer_phone})
                  </span>
                  <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-medium text-sm transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
