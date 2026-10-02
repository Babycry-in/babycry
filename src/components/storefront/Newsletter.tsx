'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF7F2] to-[#EBF7F1] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>JOIN OUR LITTLE FAMILY</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-2">
          Stay close to the little moments.
        </h2>

        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-8">
          Get new arrivals, little finds, nursery inspirations and special subscriber updates from Baby Cry.in.
        </p>

        {subscribed ? (
          <div className="p-4 bg-white/90 rounded-full inline-flex items-center gap-2 text-emerald-800 font-medium text-sm shadow-md animate-scale-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thank you for joining! We just sent a tiny hello to your inbox ♡</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white p-1.5 sm:p-2 rounded-full shadow-lg border border-emerald-100 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 sm:py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Join Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
