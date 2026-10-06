import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { getBusinessSettings } from '@/lib/data/db-service';

export const metadata = {
  title: 'About Us | Baby Cry.in',
  description: 'Learn more about Baby Cry.in - Little things for brighter little days.',
};

export default async function AboutPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF7F1] text-emerald-900 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>OUR LITTLE STORY</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Little things for brighter little days.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Welcome to Baby Cry.in — born from the belief that every little smile deserves gentle fabrics, thoughtful essentials, and products crafted with utmost care.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-[40px] border border-emerald-100 shadow-sm text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Made with pure love in Kerala
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Based in Pandikkad, Kerala, Baby Cry.in offers a curated collection of organic rompers, delicate dresses, sensory playsets, hospital maternity newborn kits, and keepsake baby shower gift hampers.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every item is tested for safety, hypoallergenic softness, and practical durability so parents can cherish every everyday milestone.
          </p>

          <div className="pt-2">
            <Link
              href="/categories"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-medium text-sm inline-flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Explore the Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-3xl border border-emerald-50 shadow-2xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">100% Organic Cotton</h3>
            <p className="text-xs text-slate-500">Toxin-free, breathable fabrics tailored for sensitive baby skin.</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-emerald-50 shadow-2xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">Curated with Heart</h3>
            <p className="text-xs text-slate-500">Every newborn set and gift hamper is packed with custom tissue and care.</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-emerald-50 shadow-2xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">Certified Baby Safe</h3>
            <p className="text-xs text-slate-500">Nickel-free snaps, smooth tags and food-grade platinum silicone.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
