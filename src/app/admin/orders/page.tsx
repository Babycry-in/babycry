import React from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/data/db-service';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const statusColors: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Processing: 'bg-purple-100 text-purple-800',
    Shipped: 'bg-indigo-100 text-indigo-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
    Cancelled: 'bg-rose-100 text-rose-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Orders ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor incoming customer orders and track fulfillment status.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">
              No orders yet
            </h3>
            <p className="text-xs text-slate-400">
              When customers complete checkout via WhatsApp, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      #{o.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{o.customer_name}</span>
                      <span className="text-[11px] text-slate-400">{o.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {o.city}, {o.state} - {o.pincode}
                    </td>
                    <td className="py-3.5 px-4">{o.items?.length || 1} items</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{o.total}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          statusColors[o.order_status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <MessageCircle className="w-3 h-3" />
                        <span>{o.whatsapp_status || 'Sent'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
