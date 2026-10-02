'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-12">
        <div className="relative bg-[#FAF7F2] w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-12">
          {/* Search Bar Input */}
          <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-emerald-700 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search soft dresses, rompers, hampers, feeding sets..."
              className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none text-base sm:text-lg"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />}
            {query && !isLoading && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-1"
            >
              ESC
            </button>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
            {!query.trim() ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Floral Bow Dress', 'Cute Bear Romper', 'Feeding Set', 'Knit Bunny Set', 'Hospital Kit'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3.5 py-1.5 bg-white text-emerald-800 border border-emerald-100 rounded-full text-xs font-medium hover:bg-emerald-50 transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="text-center py-8">
                <p className="font-heading text-slate-700 text-base">
                  No matching little goodies found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for another term like &quot;romper&quot; or &quot;hamper&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-400 mb-2">
                  {results.length} {results.length === 1 ? 'item' : 'items'} found
                </p>
                {results.map((product) => {
                  const img = product.images[0]?.cloudinary_url || '/images/babycry-logo.png';
                  const price = product.sale_price || product.price;
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 bg-white hover:bg-[#EBF7F1] rounded-2xl border border-emerald-50 shadow-xs transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-emerald-50 shrink-0">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {product.short_description || product.category?.name || 'Baby Cry.in'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-emerald-800">₹{price}</span>
                        {product.sale_price && (
                          <span className="text-xs text-slate-400 line-through block">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
