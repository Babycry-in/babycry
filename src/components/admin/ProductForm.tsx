'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Loader2, ArrowLeft, Trash2, Check, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  isEditing?: boolean;
}

export function ProductForm({
  initialProduct,
  categories,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    category_id: initialProduct?.category_id || categories[0]?.id || '',
    price: initialProduct?.price || '',
    sale_price: initialProduct?.sale_price || '',
    sku: initialProduct?.sku || '',
    stock: initialProduct?.stock ?? 15,
    gender: initialProduct?.gender || 'Unisex',
    age_group: initialProduct?.age_group || '0-24M',
    short_description: initialProduct?.short_description || '',
    description: initialProduct?.description || '',
    material: initialProduct?.material || '100% Organic Muslin Cotton',
    care_instructions: initialProduct?.care_instructions || 'Machine wash gentle cold',
    sizesText: initialProduct?.sizes?.join(', ') || '0-6M, 6-12M, 12-18M',
    colorsText: initialProduct?.colors?.join(', ') || 'Soft Mint, Warm Cream',
    featuresText: initialProduct?.features?.join('\n') || 'Ultra soft breathable fabric\nSnap bottom closures\nTagless comfort label',
    is_featured: initialProduct?.is_featured ?? false,
    is_new: initialProduct?.is_new ?? true,
    is_best_seller: initialProduct?.is_best_seller ?? false,
    is_active: initialProduct?.is_active ?? true,
  });

  const [images, setImages] = useState(initialProduct?.images || []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : autoSlug,
    }));
  };

  const handleAddUploadedImage = (url: string, publicId?: string) => {
    if (!url) return;
    setImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        cloudinary_url: url,
        cloudinary_public_id: publicId,
        sort_order: prev.length,
        is_primary: prev.length === 0,
      },
    ]);
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || !formData.price) {
      setErrorMessage('Product name and price are required.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least one product image.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: formData.category_id,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        sku: formData.sku,
        stock: Number(formData.stock),
        gender: formData.gender,
        age_group: formData.age_group,
        short_description: formData.short_description,
        description: formData.description,
        material: formData.material,
        care_instructions: formData.care_instructions,
        sizes: formData.sizesText.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colorsText.split(',').map((c) => c.trim()).filter(Boolean),
        features: formData.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        is_active: formData.is_active,
        images,
      };

      const url = isEditing && initialProduct?.id
        ? `/api/products/${initialProduct.id}`
        : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccessMessage(isEditing ? 'Product updated successfully.' : 'Product created successfully.');
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Listing</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <span>Save Product</span>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          1. General Information
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. Floral Bow Dress"
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
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-600"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Short Tagline / Summary
          </label>
          <input
            type="text"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="e.g. Pure organic muslin cotton dress with ruffle bow"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          2. Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Regular Price (₹) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sale Price (₹)
            </label>
            <input
              type="number"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              placeholder="Leave empty if none"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              SKU Code
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="BC-001"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Images & Cloudinary Upload */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          3. Product Images (Cloudinary Optimized)
        </h2>

        {/* Existing / Uploaded images preview list */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl border-2 p-2 bg-slate-50 flex flex-col justify-between ${
                  img.is_primary ? 'border-emerald-600' : 'border-slate-200'
                }`}
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.cloudinary_url}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      PRIMARY
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(idx)}
                    className="text-[11px] text-emerald-800 hover:underline font-medium flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    <span>Set Primary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ImageUploader
          label="Upload New Product Image (Auto-compressed to Cloudinary)"
          onUploadComplete={handleAddUploadedImage}
        />
      </div>

      {/* Variants & Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          4. Variants, Material & Care
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Available Sizes (Comma separated)
            </label>
            <input
              type="text"
              value={formData.sizesText}
              onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
              placeholder="0-3M, 3-6M, 6-12M"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Available Colors (Comma separated)
            </label>
            <input
              type="text"
              value={formData.colorsText}
              onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
              placeholder="Cream Floral, Mint Green"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fabric Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="100% Organic Muslin Cotton"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Care Instructions
            </label>
            <input
              type="text"
              value={formData.care_instructions}
              onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
              placeholder="Machine wash gentle cold"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Key Features (One per line)
          </label>
          <textarea
            rows={3}
            value={formData.featuresText}
            onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Visibility Toggles */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          5. Badges & Visibility
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">NEW Badge</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Featured</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_best_seller}
              onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Active (Public)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
