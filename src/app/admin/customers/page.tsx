import React from 'react';
import { getOrders } from '@/lib/data/db-service';
import { Users, Phone, Mail } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const orders = await getOrders();

  // Aggregate customers by phone/email
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }>();

  orders.forEach((o) => {
    const key = o.customer_phone || o.customer_email;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total;
      if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.created_at;
      }
    } else {
      customerMap.set(key, {
        name: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email,
        city: o.city,
        state: o.state,
        orderCount: 1,
        totalSpent: o.total,
        lastOrderDate: o.created_at,
      });
    }
  });

  const customers = Array.from(customerMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Customers ({customers.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registered and guest customers who have placed orders with Baby Cry.in.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">
              No customers yet
            </h3>
            <p className="text-xs text-slate-400">
              Customer profiles will be populated as new orders arrive.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3 h-3 text-emerald-700" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3 h-3" />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.city}, {c.state}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {c.orderCount}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      ₹{c.totalSpent}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
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
