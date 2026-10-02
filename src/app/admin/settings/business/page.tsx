import React from 'react';
import { getBusinessSettings } from '@/lib/data/db-service';
import { BusinessSettingsEditor } from '@/components/admin/BusinessSettingsEditor';

export const revalidate = 0;

export default async function AdminBusinessSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Business Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your official phone numbers, store address, social handles and free delivery thresholds.
        </p>
      </div>

      <BusinessSettingsEditor initialSettings={settings} />
    </div>
  );
}
