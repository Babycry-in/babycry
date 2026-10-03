'use client';

import React, { useState } from 'react';
import { HeroSlide } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Loader2, Check } from 'lucide-react';

interface HeroSlideEditorProps {
  initialSlide: HeroSlide;
}

export function HeroSlideEditor({ initialSlide }: HeroSlideEditorProps) {
  const [slide, setSlide] = useState<HeroSlide>(initialSlide);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hero', data: slide }),
      });

      if (!res.ok) throw new Error('Failed to update hero slide');
      setSuccess('Hero updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error updating hero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Eyebrow Small Tagline
          </label>
          <input
            type="text"
            value={slide.eyebrow}
            onChange={(e) => setSlide({ ...slide, eyebrow: e.target.value })}
            placeholder="LITTLE THINGS FOR"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Main Big Headline *
          </label>
          <input
            type="text"
            required
            value={slide.title}
            onChange={(e) => setSlide({ ...slide, title: e.target.value })}
            placeholder="Brighter Little Days"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-heading text-lg font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Supporting Description
          </label>
          <textarea
            rows={2}
            value={slide.description}
            onChange={(e) => setSlide({ ...slide, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Primary CTA Text
            </label>
            <input
              type="text"
              value={slide.primary_cta_text}
              onChange={(e) => setSlide({ ...slide, primary_cta_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Primary CTA URL
            </label>
            <input
              type="text"
              value={slide.primary_cta_url}
              onChange={(e) => setSlide({ ...slide, primary_cta_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Secondary CTA Text
            </label>
            <input
              type="text"
              value={slide.secondary_cta_text}
              onChange={(e) => setSlide({ ...slide, secondary_cta_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Secondary CTA URL
            </label>
            <input
              type="text"
              value={slide.secondary_cta_url}
              onChange={(e) => setSlide({ ...slide, secondary_cta_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploader
            label="Desktop Hero Lifestyle Image"
            currentImageUrl={slide.desktop_image}
            onUploadComplete={(url) => setSlide({ ...slide, desktop_image: url })}
          />
          <ImageUploader
            label="Mobile Hero Lifestyle Image (Recommended 9:16)"
            currentImageUrl={slide.mobile_image}
            onUploadComplete={(url) => setSlide({ ...slide, mobile_image: url })}
          />
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={slide.is_active}
              onChange={(e) => setSlide({ ...slide, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">Slide is Active</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Save Hero Slide</span>
          </button>
        </div>
      </div>
    </form>
  );
}
