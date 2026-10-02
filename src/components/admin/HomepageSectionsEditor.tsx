'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HomepageSection } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { Loader2, Check, Sparkles, Camera, Info } from 'lucide-react';

interface HomepageSectionsEditorProps {
  initialSections: HomepageSection[];
}

export function HomepageSectionsEditor({ initialSections }: HomepageSectionsEditorProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (sectionKey: string, partial: Partial<HomepageSection>) => {
    const updated = sections.map((s) => (s.section_key === sectionKey ? { ...s, ...partial } : s));
    setSections(updated);

    const target = updated.find((s) => s.section_key === sectionKey);
    if (!target) return;

    setSavingKey(sectionKey);
    setMessage(null);

    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', data: target }),
      });

      if (res.ok) {
        setMessage(`Section "${target.title}" updated successfully.`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.error('Failed to update section', e);
    } finally {
      setSavingKey(null);
    }
  };

  // Helper for updating a specific look inside "little_looks" metadata
  const handleUpdateLook = (
    sec: HomepageSection,
    lookIndex: number,
    lookField: string,
    value: string
  ) => {
    const currentLooks = sec.metadata?.looks || [
      { id: 1, image: '', alt: '', caption: '', aspectRatio: '800 / 1067' },
      { id: 2, image: '', alt: '', caption: '', aspectRatio: '800 / 533' },
      { id: 3, image: '', alt: '', caption: '', aspectRatio: '800 / 531' },
      { id: 4, image: '', alt: '', caption: '', aspectRatio: '800 / 533' },
    ];

    const updatedLooks = [...currentLooks];
    updatedLooks[lookIndex] = {
      ...updatedLooks[lookIndex],
      id: lookIndex + 1,
      [lookField]: value,
    };

    handleUpdate(sec.section_key, {
      metadata: {
        ...sec.metadata,
        looks: updatedLooks,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {sections.filter((s) => s.section_key !== 'instagram').map((sec) => {
        const isLittleLooks = sec.section_key === 'little_looks';

        return (
          <div
            key={sec.section_key}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6"
          >
            {/* Header: Key & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Section: {sec.section_key}
                  </span>
                  {isLittleLooks && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> 4-Photo Collage
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mt-1.5">
                  {sec.title}
                </h3>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={sec.is_active}
                  onChange={(e) =>
                    handleUpdate(sec.section_key, { is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-700">Section Enabled</span>
              </label>
            </div>

            {/* Standard Text Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.section_key === sec.section_key ? { ...s, title: val } : s))
                    );
                  }}
                  onBlur={(e) =>
                    handleUpdate(sec.section_key, { title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle / Eyebrow
                </label>
                <input
                  type="text"
                  value={sec.subtitle || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.section_key === sec.section_key ? { ...s, subtitle: val } : s))
                    );
                  }}
                  onBlur={(e) =>
                    handleUpdate(sec.section_key, { subtitle: e.target.value })
                  }
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
                value={sec.description || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSections((prev) =>
                    prev.map((s) => (s.section_key === sec.section_key ? { ...s, description: val } : s))
                  );
                }}
                onBlur={(e) =>
                  handleUpdate(sec.section_key, { description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={sec.cta_text || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.section_key === sec.section_key ? { ...s, cta_text: val } : s))
                    );
                  }}
                  onBlur={(e) =>
                    handleUpdate(sec.section_key, { cta_text: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Button Link URL
                </label>
                <input
                  type="text"
                  value={sec.cta_url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.section_key === sec.section_key ? { ...s, cta_url: val } : s))
                    );
                  }}
                  onBlur={(e) =>
                    handleUpdate(sec.section_key, { cta_url: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* SPECIAL EDITOR 1: LITTLE LOOKS (4 Editorial Photographs) */}
            {isLittleLooks && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      Editorial Photo Collage (4 Photographs)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload and manage each of the four physical print frames in the layered collage.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((lookIdx) => {
                    const currentLook = sec.metadata?.looks?.[lookIdx] || {
                      image: '',
                      alt: '',
                      caption: '',
                      aspectRatio: lookIdx === 0 ? '800 / 1067' : '800 / 533',
                    };

                    const titles = [
                      'Look 1 (Back / Upper-Left)',
                      'Look 2 (Center-Left / Higher)',
                      'Look 3 (Front / Center-Right)',
                      'Look 4 (Back / Right)',
                    ];

                    return (
                      <div
                        key={lookIdx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            {titles[lookIdx]}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Slot #{lookIdx + 1}
                          </span>
                        </div>

                        {/* Image Preview & Uploader */}
                        <div className="space-y-2">
                          <ImageUploader
                            label={`Upload Photo ${lookIdx + 1}`}
                            currentImageUrl={currentLook.image}
                            onUploadComplete={(url) =>
                              handleUpdateLook(sec, lookIdx, 'image', url)
                            }
                          />
                        </div>

                        {/* Alt Text & Caption */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={currentLook.alt || ''}
                              placeholder="e.g. Baby in bear fleece romper"
                              onChange={(e) =>
                                handleUpdateLook(sec, lookIdx, 'alt', e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Caption Note
                            </label>
                            <input
                              type="text"
                              value={currentLook.caption || ''}
                              placeholder="e.g. Princess little outfits ♡"
                              onChange={(e) =>
                                handleUpdateLook(sec, lookIdx, 'caption', e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                            />
                          </div>
                        </div>

                        {/* Aspect Ratio Selector */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Aspect Ratio (Contain)
                          </label>
                          <select
                            value={currentLook.aspectRatio || '800 / 1067'}
                            onChange={(e) =>
                              handleUpdateLook(sec, lookIdx, 'aspectRatio', e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="800 / 1067">Portrait 3:4 (800 × 1067)</option>
                            <option value="800 / 1200">Portrait 2:3 (800 × 1200)</option>
                            <option value="800 / 533">Landscape 3:2 (800 × 533)</option>
                            <option value="1 / 1">Square 1:1</option>
                            <option value="800 / 531">Natural (800 × 531)</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Default Banner image for other sections */}
            {!isLittleLooks && (
              <div>
                <ImageUploader
                  label="Section Banner Image"
                  currentImageUrl={sec.image_url}
                  onUploadComplete={(url) =>
                    handleUpdate(sec.section_key, { image_url: url })
                  }
                />
              </div>
            )}

            {/* Saving status */}
            {savingKey === sec.section_key && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving section changes...</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
