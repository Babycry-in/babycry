'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BusinessSettings } from '@/types/database';
import {
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
  YoutubeIcon,
  WhatsAppIcon,
} from '@/components/ui/SocialIcons';
import { Mail, MapPin, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  settings: BusinessSettings;
}

export function Footer({ settings }: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide storefront footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative w-full bg-cover bg-center bg-no-repeat pt-16 sm:pt-20 pb-8 text-slate-900"
      style={{ backgroundImage: `url('/images/footer-bg.png')` }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* TOP: Newsletter Area (Centered) */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Stay close to the little moments.
          </h3>
          <p className="text-sm sm:text-base text-slate-900 mt-2 font-bold">
            Get new arrivals, little finds and special updates from Baby Cry.in.
          </p>

          {/* Compact Newsletter Input */}
          <form
            onSubmit={handleSubscribe}
            className="mt-5 max-w-md mx-auto relative flex items-center bg-white rounded-full p-1.5 pl-6 shadow-sm border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full bg-transparent text-sm sm:text-base text-[#111111] font-semibold placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#18181B] hover:bg-black active:scale-95 text-white pl-4 pr-3 py-2 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-xs"
            >
              <span>{subscribed ? 'Joined!' : 'Join Us'}</span>
              <span className="w-5 h-5 rounded-full bg-[#A3D2B8] text-slate-900 flex items-center justify-center">
                {subscribed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-950 font-bold" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-900 font-bold" />
                )}
              </span>
            </button>
          </form>
        </div>

        {/* MAIN: 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12">
          
          {/* COLUMN 1 — BRAND */}
          <div className="space-y-4">
            <button
              onClick={handleScrollToTop}
              className="inline-block text-left cursor-pointer group focus:outline-none"
              title="Click to scroll to top"
              aria-label="Baby Cry.in - Scroll to top"
              suppressHydrationWarning
            >
              <Image
                src="/images/babycry-logo-transparent.png"
                alt="Baby Cry.in"
                width={150}
                height={40}
                className="h-9 sm:h-[84px] w-auto object-contain group-hover:opacity-85 transition-opacity"
                priority
                suppressHydrationWarning
              />
            </button>

            <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed max-w-xs">
              Little things for little ones.
            </p>

            {/* Social Icons — Bold & Dark */}
            <div className="flex items-center gap-4 pt-1 text-slate-950">
              <a
                href={`https://instagram.com/${settings.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-950 hover:text-emerald-900 transition-colors p-1"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-950 hover:text-emerald-900 transition-colors p-1"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://pinterest.com/babycryin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-950 hover:text-emerald-900 transition-colors p-1"
                aria-label="Pinterest"
              >
                <PinterestIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-950 hover:text-emerald-900 transition-colors p-1"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* COLUMN 2 — SHOP (Real Categories Only) */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
              Shop
            </h4>
            <ul className="space-y-2 text-sm sm:text-base text-slate-900 font-bold">
              <li>
                <Link href="/categories/apparels" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Apparels
                </Link>
              </li>
              <li>
                <Link href="/categories/footwear" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Footwear
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/categories/gift-and-hampers" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Gift and Hampers
                </Link>
              </li>
              <li>
                <Link href="/categories/hospital-kit" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Hospital Kit
                </Link>
              </li>
              <li>
                <Link href="/categories/toys" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Toys
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-xs sm:text-sm font-extrabold text-emerald-900 hover:underline block pt-1">
                  View All Collections →
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — HELP */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
              Help
            </h4>
            <ul className="space-y-2 text-sm sm:text-base text-slate-900 font-bold">
              <li>
                <Link href="/about" className="hover:text-emerald-900 transition-colors block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-emerald-900 transition-colors block py-0.5">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-900 transition-colors block py-0.5">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
              Contact
            </h4>
            <div className="space-y-3 text-sm sm:text-base text-slate-900 font-bold">
              {/* Phone / WhatsApp */}
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-slate-950 shrink-0" />
                <a
                  href={`https://wa.me/91${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-900 transition-colors font-bold"
                >
                  {settings.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-950 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-emerald-900 transition-colors font-bold"
                >
                  {settings.email}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-950 shrink-0 mt-1" />
                <address className="not-italic leading-relaxed font-bold text-slate-900">
                  Wandoor Road, Kanjirapadi
                  <br />
                  Pandikkad
                </address>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: Thin divider & copyright */}
        <div className="border-t border-slate-400/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-900 font-bold">
          <p>© 2026 Baby Cry.in. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-bold">
            <span>Made with</span>
            <span className="text-red-600 text-sm">♥</span>
            <span>for little ones.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
