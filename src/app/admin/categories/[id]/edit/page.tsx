import React from 'react';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/data/db-service';
import { CategoryForm } from '@/components/admin/CategoryForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCategoryPage({ params }: Props) {
  const { id } = await params;
  const categories = await getCategories(false);
  const category = categories.find((c) => c.id === id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Edit Category: {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update category visuals, banner and descriptions.
        </p>
      </div>

      <CategoryForm initialCategory={category} isEditing={true} />
    </div>
  );
}
