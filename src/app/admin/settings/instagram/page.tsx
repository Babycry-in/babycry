import React from 'react';
import { getHomepageSections } from '@/lib/data/db-service';
import { InstagramSettingsClient } from '../../../../components/admin/InstagramSettingsClient';

export const revalidate = 0;

export default async function AdminInstagramSettingsPage() {
  const sections = await getHomepageSections();
  const instagramSection = sections.find((s) => s.section_key === 'instagram') || {
    id: 'sec-instagram',
    section_key: 'instagram',
    title: 'Little moments @Baby_cry.in',
    subtitle: 'INSTAGRAM COMMUNITY',
    description: 'Tag us in your cutest baby moments to get featured!',
    cta_text: 'Follow Along',
    cta_url: 'https://instagram.com/Baby_cry.in',
    image_url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&w=400&q=80',
    is_active: true,
    display_order: 8,
    metadata: {
      images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&w=400&q=80',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&w=400&q=80',
        'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&w=400&q=80',
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&w=400&q=80',
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&w=400&q=80',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&w=400&q=80',
      ],
    },
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Instagram Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your storefront Instagram community gallery, handle link, and customer photo feed.
        </p>
      </div>

      <InstagramSettingsClient initialSection={instagramSection} />
    </div>
  );
}
