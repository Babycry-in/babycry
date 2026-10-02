import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Small SVG cloud for background decoration
function CloudBg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 75" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="60" cy="52" rx="52" ry="22" fill="#B8DDD4" fillOpacity="0.55" />
      <ellipse cx="38" cy="42" rx="28" ry="22" fill="#B8DDD4" fillOpacity="0.55" />
      <ellipse cx="76" cy="40" rx="30" ry="24" fill="#B8DDD4" fillOpacity="0.55" />
      <ellipse cx="55" cy="34" rx="22" ry="20" fill="#B8DDD4" fillOpacity="0.55" />
    </svg>
  );
}

const ESSENTIALS = [
  {
    name: 'Feeding',
    slug: 'feeding',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Teething',
    slug: 'toys',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Travel',
    slug: 'baby-gear',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Safety',
    slug: 'health-and-safety',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=400&q=80',
  },
];

export function BabyEssentialsSection() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20" style={{ background: '#DFF0EA' }}>

      {/* Decorative background clouds — scattered */}
      <CloudBg className="absolute top-2 left-2 w-28 opacity-80 pointer-events-none select-none" />
      <CloudBg className="absolute top-8 right-4 w-24 opacity-70 scale-x-[-1] pointer-events-none select-none" />
      <CloudBg className="absolute bottom-4 left-[30%] w-20 opacity-50 pointer-events-none select-none" />
      <CloudBg className="absolute bottom-2 right-[15%] w-28 opacity-45 scale-x-[-1] pointer-events-none select-none" />
      <CloudBg className="absolute top-1/2 left-[45%] w-16 opacity-30 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top row: label + heading left | View All right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-3">
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800/70 mb-2">
              BABY ESSENTIALS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
              Made for everyday<br className="hidden sm:block" /> little moments.
            </h2>
          </div>
          <Link
            href="/categories/feeding"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-900 hover:text-emerald-700 transition-colors group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Items row — each sitting on cloud-shape platform */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {ESSENTIALS.map((item) => (
            <Link
              key={item.name}
              href={`/categories/${item.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Cloud platform */}
              <div className="relative flex items-center justify-center" style={{ width: 210, height: 116 }}>
                <Image
                  src="/images/cloud-shape.png"
                  alt=""
                  fill
                  sizes="152px"
                  className="object-contain group-hover:scale-105 group-hover:drop-shadow-md transition-all duration-300"
                  aria-hidden
                />
                {/* Product image on top of cloud */}
                <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <span className="font-heading font-semibold text-slate-700 text-xs sm:text-sm mt-2.5 group-hover:text-emerald-800 transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
