'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';
import { Sparkles, ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xl py-8 px-6 lg:px-12 z-40 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Categories columns */}
        <div className="col-span-8 grid grid-cols-3 gap-6">
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={onClose}
              className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#EBF7F1] transition-colors"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-50 shrink-0">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-medium text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {cat.short_description || 'Shop adorable little picks'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Box on right side of mega menu */}
        <div className="col-span-4 bg-gradient-to-br from-[#EBF7F1] to-[#D5EDE3] p-6 rounded-3xl flex flex-col justify-between border border-emerald-200/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-semibold text-emerald-800 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Special Collection</span>
            </div>
            <h4 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Newborn Welcome Hampers & Kits
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hand-picked organic cotton essentials, soothing rattles & hospital arrivals packed with utmost love.
            </p>
          </div>
          <Link
            href="/categories/gift-and-hampers"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 group"
          >
            <span>Explore Gift Sets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
