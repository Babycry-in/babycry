import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/data/db-service';
import { Plus, Edit, Package, Eye } from 'lucide-react';
import { DeleteProductButton } from '@/components/admin';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ onlyActive: false }),
    getCategories(false),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Products ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your baby & kids catalog, inventory, and pricing.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">
              No products found
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Start building your collection by adding your first product.
            </p>
            <Link
              href="/admin/products/new"
              className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const img = p.images?.[0]?.cloudinary_url || '/images/babycry-logo.png';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              SKU: {p.sku || 'N/A'} {p.is_new && '• NEW'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          ₹{p.sale_price || p.price}
                        </span>
                        {p.sale_price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{p.price}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock > 10
                              ? 'text-emerald-700'
                              : p.stock > 0
                              ? 'text-amber-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 inline-block align-middle"
                          title="View on store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors align-middle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <DeleteProductButton
                          productId={p.id}
                          productName={p.name}
                        />
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
