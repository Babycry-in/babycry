import { Category } from '@/types/database';

/**
 * Slugs of categories featured in the top "Shop the little world" section, in priority display order.
 */
export const TOP_CATEGORY_SLUGS: string[] = [
  'apparels',
  'footwear',
  'accessories',
  'gift-and-hampers',
  'toys',
  'hospital-kit',
];

export interface HomepageCategoryItem {
  id: string;
  slug: string;
  label: string;
  image: string;
}

/** Active categories shown in the top section (only active, in defined order). */
export function getTopCategories(categories: Category[]): HomepageCategoryItem[] {
  if (!categories || !Array.isArray(categories)) return [];

  const active = categories.filter((c) => c.is_active);

  const matched: HomepageCategoryItem[] = [];
  for (const slug of TOP_CATEGORY_SLUGS) {
    const cat = active.find((c) => c.slug === slug);
    if (cat) {
      matched.push({
        id: cat.id,
        slug: cat.slug,
        label: cat.name,
        image: cat.image_url,
      });
    }
  }

  // If none of the preferred slugs matched, fallback to first 6 active categories
  if (matched.length === 0 && active.length > 0) {
    return active.slice(0, 6).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      label: cat.name,
      image: cat.image_url,
    }));
  }

  return matched;
}

/**
 * Remaining active categories for the "Baby Essentials" section.
 * Excludes everything shown in the top section (by ID and slug) and preserves admin display_order.
 */
export function getEssentialCategories(categories: Category[]): HomepageCategoryItem[] {
  if (!categories || !Array.isArray(categories)) return [];

  const top = getTopCategories(categories);
  const topIds = new Set(top.map((c) => c.id));
  const topSlugs = new Set(top.map((c) => c.slug));

  return categories
    .filter((c) => c.is_active && !topIds.has(c.id) && !topSlugs.has(c.slug))
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      label: cat.name,
      image: cat.image_url,
    }));
}
