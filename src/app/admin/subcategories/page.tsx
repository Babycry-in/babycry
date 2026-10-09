import React from 'react';
import { getCategories, getSubcategories } from '@/lib/data/db-service';
import { SubcategoriesClient } from '@/components/admin/SubcategoriesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSubcategoriesPage() {
  const [subcategories, categories] = await Promise.all([
    getSubcategories(false),
    getCategories(false),
  ]);

  return (
    <SubcategoriesClient
      initialSubcategories={subcategories}
      initialCategories={categories}
    />
  );
}
