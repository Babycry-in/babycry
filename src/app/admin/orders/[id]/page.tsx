import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getOrders } from '@/lib/data/db-service';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const orders = await getOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const cleanPhone = order.customer_phone.replace(/[^0-9]/g, '');
  const customerWhatsAppLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer_name}! This is Baby Cry.in regarding your order #${order.order_number}.`
  )}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Status updater */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Order Status:</span>
          <OrderStatusUpdater orderId={order.id} currentStatus={order.order_status} />
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Order Reference
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            #{order.order_number}
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Placed on {new Date(order.created_at).toLocaleString()}</span>
          </p>
        </div>

        <a
          href={customerWhatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20BE5B] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Message Customer on WhatsApp</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
            Customer Details
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-slate-800">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <a href={`tel:${order.customer_phone}`} className="hover:underline">
                {order.customer_phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <a href={`mailto:${order.customer_email}`} className="hover:underline break-all">
                {order.customer_email}
              </a>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
            Delivery Destination
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-800 font-medium">{order.address}</p>
                <p className="text-slate-500">
                  {order.city}, {order.state} - {order.pincode}
                </p>
                {order.delivery_instructions && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                    Note: {order.delivery_instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Items (Snapshots) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-heading font-bold text-base text-slate-900">
            Purchased Items (Immutable Snapshots)
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item, index) => (
            <div key={index} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {item.product_image_snapshot ? (
                    <Image
                      src={item.product_image_snapshot}
                      alt={item.product_name_snapshot}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {item.product_name_snapshot}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Variant: {item.variant_snapshot || 'Standard'} • Qty: {item.quantity}
                  </p>
                  <p className="text-xs text-slate-500 sm:hidden block mt-1">
                    ₹{item.unit_price} each
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  ₹{item.total_price}
                </span>
                <span className="text-xs text-slate-400 hidden sm:block">
                  ₹{item.unit_price} × {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Calculation summary */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-slate-800">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-medium text-slate-800">
              {order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
            <span>Grand Total</span>
            <span className="text-emerald-900 font-heading text-xl">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
