import React from 'react';
import { getMediaLibrary } from '@/lib/data/db-service';
import { MediaLibraryClient } from '@/components/admin/MediaLibraryClient';

export const revalidate = 0;

export default async function AdminMediaPage() {
  const media = await getMediaLibrary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
          Media Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Browse and manage all images hosted on Cloudinary and website assets.
        </p>
      </div>

      <MediaLibraryClient initialMedia={media} />
    </div>
  );
}
