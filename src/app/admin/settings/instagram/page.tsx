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
    image_url: '',
    is_active: true,
    display_order: 8,
    metadata: {
      images: [],
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
