import React from 'react';
import { getCategories, getSubcategories } from '@/lib/data/db-service';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function AdminNewProductPage() {
  const [categories, subcategories] = await Promise.all([
    getCategories(false),
    getSubcategories(false),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Create New Product
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add an adorable baby outfit, essential kit, or accessory to your store.
        </p>
      </div>

      <ProductForm
        categories={categories}
        subcategories={subcategories}
        isEditing={false}
      />
    </div>
  );
}
