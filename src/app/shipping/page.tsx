import React from 'react';
import Link from 'next/link';
import { getBusinessSettings } from '@/lib/data/db-service';
import { Truck, ShieldCheck, MapPin, Phone, MessageCircle, ChevronRight, Home } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Information | Baby Cry.in',
  description:
    'Free delivery across India on orders over ₹999. Standard shipping ₹99. Orders dispatched carefully from Pandikkad, Kerala.',
  alternates: {
    canonical: 'https://www.babycry.in/shipping',
  },
  openGraph: {
    title: 'Shipping & Delivery Information | Baby Cry.in',
    description: 'Learn about our shipping rates, free delivery thresholds, and order dispatch process.',
    url: 'https://www.babycry.in/shipping',
    type: 'website',
  },
};

export default async function ShippingPage() {
  const settings = await getBusinessSettings();
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-emerald-800 flex items-center gap-1 shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-emerald-900 shrink-0" aria-current="page">
            Shipping & Delivery
          </span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivery Information</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Shipping & Delivery
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Every little parcel is packed with utmost love and handled with care.
          </p>
        </div>

        {/* Shipping Rates Card */}
        <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-100 shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Shipping Rates & Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Orders Above ₹{settings.free_shipping_threshold}
              </span>
              <p className="text-2xl font-bold text-emerald-900">FREE Delivery</p>
              <p className="text-xs text-slate-600">
                All cart subtotals of ₹{settings.free_shipping_threshold} or more qualify automatically for free standard shipping.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Standard Shipping Fee
              </span>
              <p className="text-2xl font-bold text-slate-900">₹{settings.standard_delivery_fee}</p>
              <p className="text-xs text-slate-600">
                A flat fee of ₹{settings.standard_delivery_fee} applies to orders below ₹{settings.free_shipping_threshold}.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Dispatch Location</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  All packages are carefully inspected and dispatched directly from our store in {settings.address}.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Order Updates & Tracking</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Once your order is confirmed, dispatch updates and tracking details are shared directly with you via WhatsApp and email.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Have questions about your delivery or urgent requirements?</p>
              <p className="text-sm font-semibold text-slate-800">Contact our support team directly</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`https://wa.me/91${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BE5B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
