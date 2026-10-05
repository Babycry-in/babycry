'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface CategoryFormProps {
  initialCategory?: Category;
  isEditing?: boolean;
}

export function CategoryForm({ initialCategory, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    slug: initialCategory?.slug || '',
    short_description: initialCategory?.short_description || '',
    image_url: initialCategory?.image_url || '',
    banner_url: initialCategory?.banner_url || '',
    mobile_banner_url: initialCategory?.mobile_banner_url || '',
    display_order: initialCategory?.display_order || 1,
    is_active: initialCategory?.is_active ?? true,
    seo_title: initialCategory?.seo_title || '',
    seo_description: initialCategory?.seo_description || '',
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

    if (!formData.name) {
      setError('Category name is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: initialCategory?.id,
        ...formData,
      };

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      setSuccess('Category saved successfully.');
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
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
            <span>Save Category</span>
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <ImageUploader
            label="Category Card Thumbnail"
            currentImageUrl={formData.image_url}
            onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
          />

          <ImageUploader
            label="Category Hero Banner (Optional)"
            currentImageUrl={formData.banner_url}
            onUploadComplete={(url) => setFormData({ ...formData, banner_url: url })}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Active (Visible in Store)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
