'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Subcategory } from '@/types/database';
import { X, MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

interface MobileMenuProps {
  categories: CategoryWithSubs[];
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export function MobileMenu({ categories, isOpen, onClose, phone }: MobileMenuProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Lock background scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden lg:hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop overlay with smooth fade */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer anchored to RIGHT edge with smooth slide-in and slide-out */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF7F2] shadow-2xl flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-white">
              <Logo size="sm" />
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Navigation */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-210px)] space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 px-2 py-2">
                Shop By Category
              </p>
              <Link
                href="/categories"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-medium text-sm"
              >
                <span>Shop All Collection</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>

              {categories.map((cat) => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expandedId === cat.id;

                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={onClose}
                        className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white text-slate-700 hover:text-emerald-800 text-sm font-medium transition-colors"
                      >
                        <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-white border border-emerald-100/70 p-0.5 shrink-0 flex items-center justify-center">
                          {cat.image_url ? (
                            <Image
                              src={cat.image_url}
                              alt={cat.name}
                              fill
                              sizes="32px"
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-emerald-400 text-sm">🧸</span>
                          )}
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="p-2 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors"
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name} subcategories`}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-emerald-700' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {hasSubs && (
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-12 mr-2 mt-0.5 mb-1 space-y-0.5">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${cat.slug}?sub=${sub.slug}`}
                              onClick={onClose}
                              className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="border-t border-emerald-100/80 my-3 pt-3 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 px-2 py-1">
                  Explore More
                </p>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl hover:bg-white text-slate-700 text-sm font-medium"
                >
                  About Baby Cry.in
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl hover:bg-white text-slate-700 text-sm font-medium"
                >
                  Contact & Store Location
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Contact Footer in Menu */}
          <div className="p-4 border-t border-emerald-100 bg-white space-y-2">
            <a
              href={`https://wa.me/91${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({phone})</span>
            </a>
            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                Baby Cry.in • Pandikkad, Kerala
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
