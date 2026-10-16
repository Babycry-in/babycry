import type { MetadataRoute } from 'next';
import { getCategoriesWithSubcategories, getProducts } from '@/lib/data/db-service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // revalidate cache every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.babycry.in';

  // 1. High-value static public storefront pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const [categoriesWithSubs, products] = await Promise.all([
      getCategoriesWithSubcategories(true),
      getProducts({ onlyActive: true }),
    ]);

    // 2. Active Parent Categories
    const categoryRoutes: MetadataRoute.Sitemap = categoriesWithSubs
      .filter((cat) => cat.is_active !== false && cat.slug)
      .map((cat) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: cat.updated_at || cat.created_at ? new Date(cat.updated_at || cat.created_at!) : undefined,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    // 3. Active Subcategories using clean URLs
    const subcategoryRoutes: MetadataRoute.Sitemap = [];
    for (const cat of categoriesWithSubs) {
      if (cat.is_active !== false && cat.subcategories && cat.subcategories.length > 0) {
        for (const sub of cat.subcategories) {
          if (sub.is_active !== false && sub.slug) {
            subcategoryRoutes.push({
              url: `${baseUrl}/categories/${cat.slug}/${sub.slug}`,
              lastModified: sub.created_at ? new Date(sub.created_at) : undefined,
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        }
      }
    }

    // 4. Published, Active Products
    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p.is_active !== false && p.slug)
      .map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updated_at || p.created_at ? new Date(p.updated_at || p.created_at!) : undefined,
        changeFrequency: 'daily',
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...subcategoryRoutes,
      ...productRoutes,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticRoutes;
  }
}
