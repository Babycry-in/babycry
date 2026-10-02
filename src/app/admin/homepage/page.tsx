import React from 'react';
import Link from 'next/link';
import { getHomepageSections } from '@/lib/data/db-service';
import { HomepageSectionsEditor } from '@/components/admin/HomepageSectionsEditor';
import { Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function AdminHomepageBuilderPage() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Homepage Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Toggle, edit text, banners and call-to-actions for all visual editorial sections.
          </p>
        </div>

        <Link
          href="/admin/homepage/hero"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Edit Hero Banner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <HomepageSectionsEditor initialSections={sections} />
    </div>
  );
}
