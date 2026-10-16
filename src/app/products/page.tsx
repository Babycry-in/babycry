import React, { Suspense } from 'react';
import Link from 'next/link';
import { getCategoriesWithSubcategories, getProducts } from '@/lib/data/db-service';
import { CategoryProductGrid } from '@/components/category/CategoryProductGrid';
import { Home, ChevronRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Banner — matching category page layout */}
      <div className="relative bg-gradient-to-r from-[#D8EFE4] to-[#FAF7F2] py-12 sm:py-16 overflow-hidden border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 overflow-x-auto pb-1">
            <Link href="/" className="hover:text-emerald-800 flex items-center gap-1 shrink-0">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-emerald-900 shrink-0" aria-current="page">
              All Products
            </span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              All Products
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Explore our complete collection of cute outfits, thoughtful essentials, gentle pre-walkers, and handpicked baby gifts.
            </p>
          </div>

        </div>
      </div>

      {/* Main Products List Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
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
