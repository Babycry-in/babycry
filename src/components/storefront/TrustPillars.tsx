import React from 'react';
import { Sparkles, HeartHandshake, Smile, PackageCheck } from 'lucide-react';

export function TrustPillars() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Thoughtfully Selected',
      description: 'Only the best for little ones',
    },
    {
      icon: Smile,
      title: 'Cute Everyday Essentials',
      description: 'Made for daily moments',
    },
    {
      icon: HeartHandshake,
      title: 'Little Moments, Beautifully Made',
      description: 'Designed with love',
    },
    {
      icon: PackageCheck,
      title: 'Packed With Love',
      description: 'Because they deserve it',
    },
  ];

  return (
    <section className="py-12 bg-[#FAF7F2] border-t border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {pillars.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF7F1] flex items-center justify-center text-emerald-700 mb-3 shadow-2xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-semibold text-slate-800 text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
