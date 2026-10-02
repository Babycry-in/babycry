import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/data/db-service';
import { CategoryProductGrid } from '@/components/category/CategoryProductGrid';
import { ChevronRight, Home, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: category.seo_title || `${category.name} | Baby Cry.in`,
    description:
      category.seo_description ||
      category.short_description ||
      `Shop ${category.name} online at Baby Cry.in.`,
    openGraph: {
      title: `${category.name} | Baby Cry.in`,
      description: category.short_description,
      images: [
        {
          url: category.banner_url || category.image_url,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [products, allCategories] = await Promise.all([
    getProducts({ categoryId: category.id, onlyActive: true }),
    getCategories(true),
  ]);

  const otherCategories = allCategories.filter((c) => c.id !== category.id).slice(0, 4);

  // JSON-LD structured breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://babycry.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://babycry.in/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://babycry.in/categories/${category.slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Category Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#D8EFE4] to-[#FAF7F2] py-12 sm:py-16 overflow-hidden border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-emerald-800 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/categories" className="hover:text-emerald-800">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-emerald-900">{category.name}</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              {category.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              {category.short_description ||
                'Thoughtfully designed essentials and clothing made for comfortable every day baby moments.'}
            </p>
          </div>

        </div>

        {/* Background Banner Preview */}
        {category.banner_url && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-25 pointer-events-none">
            <Image
              src={category.banner_url}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Main Products List Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CategoryProductGrid products={products} />

        {/* Related Categories Row */}
        {otherCategories.length > 0 && (
          <div className="mt-20 pt-12 border-t border-emerald-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                You May Also Love
              </h2>
              <Link
                href="/categories"
                className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="group p-3 bg-white rounded-2xl border border-emerald-50 shadow-2xs hover:shadow-md transition-all text-center"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-emerald-50 mb-2">
                    <Image
                      src={c.image_url}
                      alt={c.name}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="font-heading font-medium text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
