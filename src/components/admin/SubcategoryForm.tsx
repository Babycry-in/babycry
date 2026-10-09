'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Subcategory } from '@/types/database';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface SubcategoryFormProps {
  initialSubcategory?: Subcategory;
  categories: Category[];
  isEditing?: boolean;
}

export function SubcategoryForm({
  initialSubcategory,
  categories,
  isEditing = false,
}: SubcategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category_id: initialSubcategory?.category_id || (categories[0]?.id ?? ''),
    name: initialSubcategory?.name || '',
    slug: initialSubcategory?.slug || '',
    description: initialSubcategory?.description || '',
    display_order: initialSubcategory?.display_order || 1,
    is_active: initialSubcategory?.is_active ?? true,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : autoSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) { setError('Subcategory name is required.'); return; }
    if (!formData.slug) { setError('Slug is required.'); return; }
    if (!formData.category_id) { setError('Please select a parent category.'); return; }

    setLoading(true);
    try {
      const url = isEditing && initialSubcategory?.id
        ? `/api/subcategories/${initialSubcategory.id}`
        : '/api/subcategories';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing
        ? { ...formData, id: initialSubcategory!.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save subcategory');

      setSuccess('Subcategory saved successfully.');
      setTimeout(() => {
        router.push('/admin/subcategories');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error saving subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/subcategories"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subcategories</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEditing ? 'Update Subcategory' : 'Create Subcategory'}</span>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Parent Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Parent Category *
          </label>
          <select
            required
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          >
            <option value="">— Select a category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Subcategory Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. Dresses, Baby Shoes, Bibs…"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Slug & Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-emerald-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">Must be unique. Auto-generated from name.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Display Order
            </label>
            <input
              type="number"
              min={1}
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description (optional)
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Active */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Active (Visible in Dropdowns & Filters)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
