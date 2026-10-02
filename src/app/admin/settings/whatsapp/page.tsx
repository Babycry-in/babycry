import React from 'react';
import { getBusinessSettings } from '@/lib/data/db-service';
import { WhatsAppSettingsClient } from '@/components/admin/WhatsAppSettingsClient';

export default async function AdminWhatsAppSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WhatsAppSettingsClient initialSettings={settings} />
    </div>
  );
}
