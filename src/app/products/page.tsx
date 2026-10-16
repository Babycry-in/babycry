import React, { Suspense } from 'react';
import { getCategoriesWithSubcategories, getProducts } from '@/lib/data/db-service';
import { CategoryProductGrid } from '@/components/category/CategoryProductGrid';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Products | Baby Cry.in',
  description: 'Browse all baby products, organic cotton clothes, infant essentials, pre-walkers, and gift sets at Baby Cry.in.',
  alternates: {
    canonical: 'https://www.babycry.in/products',
  },
  openGraph: {
    title: 'All Products | Baby Cry.in',
    description: 'Explore our complete collection of cute outfits, thoughtful essentials, gentle pre-walkers, and handpicked baby gift hampers.',
    url: 'https://www.babycry.in/products',
    type: 'website',
  },
};

export default async function AllProductsPage() {
  const [categoriesWithSubs, products] = await Promise.all([
    getCategoriesWithSubcategories(true),
    getProducts({ onlyActive: true }),
  ]);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.babycry.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Products',
        item: 'https://www.babycry.in/products',
      },
    ],
  };

  return (
    <div className="py-8 sm:py-14 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>COMPLETE COLLECTION</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900">
            All Products
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 sm:mt-3">
            Explore our complete collection of cute outfits, thoughtful hospital maternity kits, gentle pre-walkers, and handpicked baby gifts.
          </p>
        </div>

        {/* Full Product Grid with Filter Sidebar, Mobile Filter Drawer, Sorting & Real Products */}
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            </div>
          }
        >
          <CategoryProductGrid
            products={products}
            categories={categoriesWithSubs}
            initialCategoryId="all"
          />
        </Suspense>

      </div>
    </div>
  );
}
