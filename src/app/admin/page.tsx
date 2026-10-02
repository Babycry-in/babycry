import React from 'react';
import Link from 'next/link';
import { getOrders, getProducts, getCategories } from '@/lib/data/db-service';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Users,
  IndianRupee,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [orders, products, categories] = await Promise.all([
    getOrders(),
    getProducts({ onlyActive: false }),
    getCategories(false),
  ]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.order_status === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.order_status === 'Delivered').length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;

  // Derive unique customer count from orders
  const uniqueCustomerEmails = new Set(orders.map((o) => o.customer_email || o.customer_phone));
  const totalCustomers = uniqueCustomerEmails.size;

  const recentOrders = orders.slice(0, 6);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Confirmed Orders',
      value: confirmedOrders,
      icon: CheckCircle2,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Delivered Orders',
      value: deliveredOrders,
      icon: Truck,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Products',
      value: `${activeProducts} / ${totalProducts}`,
      icon: Package,
      color: 'bg-orange-50 text-orange-700',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Store Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time metrics and sales activity for Baby Cry.in
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-slate-900">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest incoming baby orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No orders yet</p>
            <p className="text-xs text-slate-400 mt-1">
              New customer orders will appear here automatically in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    Pending: 'bg-amber-100 text-amber-800',
                    Confirmed: 'bg-blue-100 text-blue-800',
                    Processing: 'bg-purple-100 text-purple-800',
                    Shipped: 'bg-indigo-100 text-indigo-800',
                    Delivered: 'bg-emerald-100 text-emerald-800',
                    Cancelled: 'bg-rose-100 text-rose-800',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        #{order.order_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {order.customer_name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {order.customer_phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.items?.length || 1} items
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{order.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            statusColors[order.order_status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-xs font-medium transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
