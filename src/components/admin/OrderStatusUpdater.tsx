'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/types/database';
import { Loader2, Check } from 'lucide-react';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus);
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
      >
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
      {saved && (
        <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Status Updated</span>
        </span>
      )}
    </div>
  );
}
