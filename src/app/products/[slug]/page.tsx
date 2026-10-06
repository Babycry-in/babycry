import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getBusinessSettings } from '@/lib/data/db-service';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ChevronRight, Home, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const primaryImg =
    product.images?.find((i) => i.is_primary)?.cloudinary_url ||
    product.images?.[0]?.cloudinary_url;

  return {
    title: product.seo_title || `${product.name} | Baby Cry.in`,
    description:
      product.seo_description ||
      product.short_description ||
      `Buy ${product.name} online at Baby Cry.in.`,
    openGraph: {
      title: `${product.name} | Baby Cry.in`,
      description: product.short_description,
      images: primaryImg ? [{ url: primaryImg, alt: product.name }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, settings] = await Promise.all([
    getProducts({ categoryId: product.category_id, onlyActive: true }),
    getBusinessSettings(),
  ]);

  const otherProducts = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const primaryImg =
    product.images?.find((i) => i.is_primary)?.cloudinary_url ||
    product.images?.[0]?.cloudinary_url ||
    'https://babycry.in/images/babycry-logo.png';

  // Product Structured Data JSON-LD
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: primaryImg,
    description: product.description || product.short_description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Baby Cry',
    },
    offers: {
      '@type': 'Offer',
      url: `https://babycry.in/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.sale_price || product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-emerald-800 flex items-center gap-1 shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-emerald-800 shrink-0"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </>
          )}
          <span className="font-semibold text-emerald-900 truncate">
            {product.name}
          </span>
        </nav>

        {/* Gallery & Buy Section */}
        <ProductDetailClient
          product={product}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* Product In-depth Details & Specifications */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-emerald-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Description & Features */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Product Details
              </h2>
              <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-heading text-lg font-bold text-slate-800">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-700 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Card */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4 h-fit">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Fabric & Care
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Material</span>
                  <span className="font-semibold text-slate-800">
                    {product.material || '100% Organic Cotton'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Age Group</span>
                  <span className="font-semibold text-slate-800">
                    {product.age_group || 'Newborn - 24M'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Gender</span>
                  <span className="font-semibold text-slate-800">
                    {product.gender || 'Unisex'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Care Instructions</span>
                  <span className="font-medium text-slate-700 text-xs">
                    {product.care_instructions || 'Gentle machine wash cold. Do not bleach.'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-emerald-100">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-8">
              More from {product.category?.name || 'this collection'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {otherProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
