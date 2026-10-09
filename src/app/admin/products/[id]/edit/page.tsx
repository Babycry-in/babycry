import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getCategories, getSubcategories } from '@/lib/data/db-service';
import { ProductForm } from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories, subcategories] = await Promise.all([
    getProductById(id),
    getCategories(false),
    getSubcategories(false),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Edit Product: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update prices, images, stock and product details.
        </p>
      </div>

      <ProductForm
        initialProduct={product}
        categories={categories}
        subcategories={subcategories}
        isEditing={true}
      />
    </div>
  );
}
