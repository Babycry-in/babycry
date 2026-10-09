'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { Category, Subcategory } from '@/types/database';

interface SubcategoriesClientProps {
  initialSubcategories: Subcategory[];
  initialCategories: Category[];
}

export function SubcategoriesClient({
  initialSubcategories,
  initialCategories,
}: SubcategoriesClientProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const reloadData = async () => {
    try {
      const [subRes, catRes] = await Promise.all([
        fetch('/api/subcategories?onlyActive=false'),
        fetch('/api/categories'),
      ]);
      const subData = await subRes.json();
      const catData = await catRes.json();
      if (subData.subcategories) setSubcategories(subData.subcategories);
      if (catData.categories) setCategories(catData.categories);
    } catch (e) {
      console.error('Failed to reload subcategories', e);
    }
  };

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || '—';

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      await reloadData();
    } catch (e) {
      console.error('Failed to delete subcategory', e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (sub: Subcategory) => {
    setTogglingId(sub.id);
    try {
      const updated = { ...sub, is_active: !sub.is_active };
      setSubcategories((prev) =>
        prev.map((s) => (s.id === sub.id ? updated : s))
      );
      await fetch(`/api/subcategories/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      await reloadData();
    } catch (e) {
      console.error('Failed to toggle subcategory status', e);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Subcategories ({subcategories.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage subcategories nested under main categories.
          </p>
        </div>
        <Link
          href="/admin/subcategories/new"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {subcategories.length === 0 ? (
          <div className="py-16 text-center">
            <Layers className="w-10 h-10 mx-auto text-emerald-200 mb-3" />
            <p className="text-slate-500 text-sm font-medium">No subcategories yet.</p>
            <p className="text-slate-400 text-xs mt-1">
              Create subcategories to organise your product listings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Subcategory Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subcategories.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      #{s.display_order}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      {s.description && (
                        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {s.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {s.slug}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {categoryName(s.category_id)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(s)}
                        disabled={togglingId === s.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          s.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {togglingId === s.id ? '…' : s.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/subcategories/${s.id}/edit`}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        disabled={deletingId === s.id}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === s.id ? 'Deleting…' : 'Delete'}</span>
                      </button>
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
