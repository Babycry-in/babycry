'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/database';
import { X, MessageCircle, Phone, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface MobileMenuProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export function MobileMenu({ categories, isOpen, onClose, phone }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF7F2] shadow-2xl flex flex-col justify-between">
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
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-210px)] space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 px-2 py-1">
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
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white text-slate-700 hover:text-emerald-800 text-sm font-medium transition-colors"
                >
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-emerald-50 shrink-0">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}

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
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl hover:bg-white text-emerald-700 text-sm font-semibold"
                >
                  Admin Portal ⚙️
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
