import React from 'react';
import { notFound } from 'next/navigation';
import { getCategories, getSubcategories } from '@/lib/data/db-service';
import { SubcategoryForm } from '@/components/admin/SubcategoryForm';

export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSubcategoryPage({ params }: Props) {
  const { id } = await params;
  const [allSubcategories, categories] = await Promise.all([
    getSubcategories(false),
    getCategories(false),
  ]);
  const subcategory = allSubcategories.find((s) => s.id === id);
  if (!subcategory) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Edit Subcategory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update &ldquo;{subcategory.name}&rdquo;
        </p>
      </div>
      <SubcategoryForm
        initialSubcategory={subcategory}
        categories={categories}
        isEditing
      />
    </div>
  );
}
