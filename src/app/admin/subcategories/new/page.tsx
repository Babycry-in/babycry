import React from 'react';
import { getCategories } from '@/lib/data/db-service';
import { SubcategoryForm } from '@/components/admin/SubcategoryForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewSubcategoryPage() {
  const categories = await getCategories(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          New Subcategory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add a subcategory nested under a main category.
        </p>
      </div>
      <SubcategoryForm categories={categories} />
    </div>
  );
}
