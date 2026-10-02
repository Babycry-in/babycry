import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export function UnboxingSection() {
  return (
    <section className="py-10 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[40px] bg-gradient-to-r from-[#D7D2C8] via-[#E8E2D7] to-[#D5CFC3] p-8 sm:p-12 border border-slate-300/40 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
              Unbox the cuteness.
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              A little love packed into every order. Eco-friendly kraft boxes with custom baby tissue and heartfelt notes.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="px-6 py-2.5 bg-[#96D1BC] hover:bg-[#7FBFA8] text-emerald-950 font-bold text-xs sm:text-sm rounded-full shadow-xs inline-flex items-center gap-2 transition-colors"
              >
                <span>Our Packaging</span>
                <Heart className="w-3.5 h-3.5 fill-emerald-950" />
              </Link>
            </div>
          </div>

          {/* Kraft box illustration / stamp */}
          <div className="relative w-72 sm:w-80 h-36 sm:h-40 rounded-3xl bg-[#CBBFA8] shadow-inner p-4 flex flex-col items-center justify-center border-2 border-[#B9AD94] shrink-0">
            <div className="relative w-44 h-14">
              <Image
                src="/images/babycry-logo.png"
                alt="Baby Cry.in Kraft Packaging"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-heading text-[11px] text-amber-950/80 font-medium mt-1">
              Delivered fresh to your doorstep ♡
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
