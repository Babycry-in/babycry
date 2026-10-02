import React from 'react';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminNewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Create Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add a new baby & kids collection to your store.
        </p>
      </div>

      <CategoryForm isEditing={false} />
    </div>
  );
}
