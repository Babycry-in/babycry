'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react';

interface MediaLibraryClientProps {
  initialMedia: MediaItem[];
}

export function MediaLibraryClient({ initialMedia }: MediaLibraryClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.cloudinary_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error('Delete media failed', e);
    }
  };

  const handleUploadComplete = (url: string, publicId?: string) => {
    if (!url) return;
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      file_name: url.split('/').pop() || 'uploaded-image',
      cloudinary_url: url,
      cloudinary_public_id: publicId,
      used_by: 'New Upload',
      created_at: new Date().toISOString(),
    };
    setMediaList([newItem, ...mediaList]);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="font-heading font-bold text-base text-slate-900 mb-3">
          Upload New Asset
        </h2>
        <ImageUploader onUploadComplete={handleUploadComplete} />
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="font-heading font-bold text-base text-slate-900 mb-4">
          All Media Files ({mediaList.length})
        </h2>

        {mediaList.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No media files in library</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#FAF7F2] rounded-2xl p-2.5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-2">
                  <Image
                    src={item.cloudinary_url}
                    alt={item.file_name}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Used for: {item.used_by || 'General'}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
