'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  variant?: 'icon' | 'button';
  redirectOnDelete?: string;
  className?: string;
}

export function DeleteProductButton({
  productId,
  productName,
  variant = 'icon',
  redirectOnDelete,
  className = '',
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      setIsOpen(false);
      if (redirectOnDelete) {
        router.push(redirectOnDelete);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while deleting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
          className={`p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 inline-flex items-center justify-center transition-colors align-middle ${className}`}
          title={`Delete ${productName}`}
          aria-label={`Delete ${productName}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
          className={`px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-2xs ${className}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Product</span>
        </button>
      )}

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Delete Product?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">&quot;{productName}&quot;</strong>?
              All photos, price details, and inventory for this item will be removed from your store.
            </p>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
