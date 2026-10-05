'use client';

import React, { useState } from 'react';
import { HomepageSection } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Loader2, Check, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/SocialIcons';

interface InstagramSettingsClientProps {
  initialSection: HomepageSection;
}

export function InstagramSettingsClient({ initialSection }: InstagramSettingsClientProps) {
  const [section, setSection] = useState<HomepageSection>(initialSection);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (updatedData: HomepageSection) => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', data: updatedData }),
      });

      if (res.ok) {
        setMessage('Instagram settings saved successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.error('Failed to update Instagram section', e);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof HomepageSection, value: any) => {
    const updated = { ...section, [field]: value };
    setSection(updated);
  };

  const handleImageChange = (index: number, url: string) => {
    const defaultList = ['', '', '', '', '', ''];
    const currentList = Array.isArray(section.metadata?.images) ? section.metadata.images : defaultList;
    const nextList = [...currentList];
    nextList[index] = url;

    const updated = {
      ...section,
      metadata: {
        ...section.metadata,
        images: nextList,
      },
    };
    setSection(updated);
    handleSave(updated);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        
        {/* Toggle Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Instagram Section Controls
              </h3>
              <p className="text-xs text-slate-500">
                Display a vibrant community photo strip near the bottom of your homepage.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer self-start sm:self-auto bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={section.is_active}
              onChange={(e) => {
                const next = { ...section, is_active: e.target.checked };
                setSection(next);
                handleSave(next);
              }}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">Section Enabled on Storefront</span>
          </label>
        </div>

        {/* Text Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              onBlur={() => handleSave(section)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Eyebrow / Subtitle
            </label>
            <input
              type="text"
              value={section.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              onBlur={() => handleSave(section)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={section.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleSave(section)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Button Label
            </label>
            <input
              type="text"
              value={section.cta_text || ''}
              onChange={(e) => handleFieldChange('cta_text', e.target.value)}
              onBlur={() => handleSave(section)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Instagram Profile Link
            </label>
            <div className="relative">
              <input
                type="text"
                value={section.cta_url || ''}
                onChange={(e) => handleFieldChange('cta_url', e.target.value)}
                onBlur={() => handleSave(section)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 pr-10"
              />
              {section.cta_url && (
                <a
                  href={section.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 6 Photo Feed Slots */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-rose-600" />
              Community Photo Feed (6 Photographs)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any photo to upload or replace it with a customer snapshot, look, or product image.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const defaultImages = ['', '', '', '', '', ''];
              const list = Array.isArray(section.metadata?.images) ? section.metadata.images : defaultImages;
              const imgUrl = list[idx] || '';

              return (
                <div
                  key={idx}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col items-center space-y-2 text-center"
                >
                  <span className="text-[10px] font-bold text-slate-600 uppercase">
                    Photo #{idx + 1}
                  </span>

                  <div className="w-full">
                    <ImageUploader
                      label={`Slot ${idx + 1}`}
                      currentImageUrl={imgUrl}
                      onUploadComplete={(url) => handleImageChange(idx, url)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save button & status */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSave(section)}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving...' : 'Save Instagram Settings'}</span>
          </button>

          {saving && (
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving changes...
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export default InstagramSettingsClient;
