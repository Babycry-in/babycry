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
import { Mail, MapPin, ArrowRight, Check, ChevronDown } from 'lucide-react';

interface FooterProps {
  settings: BusinessSettings;
}

export function Footer({ settings }: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  // Mobile accordion: which footer menu is open (only one at a time)
  const [openMenu, setOpenMenu] = useState<'shop' | 'help' | null>(null);

  // Hide storefront footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  // Mobile accordion data
  const mobileMenus: {
    key: 'shop' | 'help';
    title: string;
    links: { href: string; label: string }[];
    extra?: { href: string; label: string };
  }[] = [
    {
      key: 'shop',
      title: 'Shop',
      links: [
        { href: '/categories/apparels', label: 'Apparels' },
        { href: '/categories/footwear', label: 'Footwear' },
        { href: '/categories/accessories', label: 'Accessories' },
        { href: '/categories/gift-and-hampers', label: 'Gift & Hampers' },
        { href: '/categories/hospital-kit', label: 'Hospital Kit' },
        { href: '/categories/toys', label: 'Toys' },
      ],
      extra: { href: '/categories', label: 'View All Collections →' },
    },
    {
      key: 'help',
      title: 'Help',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/shipping', label: 'Shipping' },
        { href: '/returns', label: 'Returns' },
        { href: '/faq', label: 'FAQs' },
      ],
    },
  ];

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
      className="relative w-full bg-cover bg-center bg-no-repeat pt-10 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 text-slate-900"
      style={{ backgroundImage: `url('/images/Pastel-footer.png')` }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10">
        
        {/* TOP: Newsletter Area (Centered) */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 lg:mb-16">
          <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111111] tracking-tight">
            Stay close to the little moments.
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-slate-900 mt-1.5 sm:mt-2 font-bold">
            Get new arrivals, little finds and special updates from Baby Cry.in.
          </p>

          {/* Compact Newsletter Input */}
          <form
            onSubmit={handleSubscribe}
            className="mt-4 sm:mt-5 max-w-md mx-auto relative flex items-center bg-white rounded-full p-1.5 pl-5 sm:pl-6 shadow-sm border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full bg-transparent text-xs sm:text-sm lg:text-base text-[#111111] font-semibold placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#18181B] hover:bg-black active:scale-95 text-white pl-3 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs"
            >
              <span>{subscribed ? 'Joined!' : 'Join Us'}</span>
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#A3D2B8] text-slate-900 flex items-center justify-center">
                {subscribed ? (
                  <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-950 font-bold" />
                ) : (
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-900 font-bold" />
                )}
              </span>
            </button>
          </form>
        </div>

        {/* ── DESKTOP (lg+): Full 4-column Layout (unchanged) ── */}
        <div className="hidden lg:grid grid-cols-4 gap-8 lg:gap-12 pb-12">
          
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
                className="h-[84px] w-auto object-contain group-hover:opacity-85 transition-opacity"
                priority
                suppressHydrationWarning
              />
            </button>

            <p className="text-sm lg:text-base text-slate-900 font-bold leading-relaxed max-w-xs">
              Little things for little ones.
            </p>

            <div className="flex items-center gap-4 pt-1 text-slate-950">
              <a href={`https://instagram.com/${settings.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors p-1" aria-label="Instagram">
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors p-1" aria-label="Facebook">
                <FacebookIcon className="w-4.5 h-4.5" />
              </a>
              <a href="https://pinterest.com/babycryin" target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors p-1" aria-label="Pinterest">
                <PinterestIcon className="w-4.5 h-4.5" />
              </a>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors p-1" aria-label="YouTube">
                <YoutubeIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* COLUMN 2 — SHOP */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-lg text-slate-950">Shop</h4>
            <ul className="space-y-2 text-sm lg:text-base text-slate-900 font-bold">
              <li><Link href="/categories/apparels" className="hover:text-emerald-900 transition-colors block py-0.5">Apparels</Link></li>
              <li><Link href="/categories/footwear" className="hover:text-emerald-900 transition-colors block py-0.5">Footwear</Link></li>
              <li><Link href="/categories/accessories" className="hover:text-emerald-900 transition-colors block py-0.5">Accessories</Link></li>
              <li><Link href="/categories/gift-and-hampers" className="hover:text-emerald-900 transition-colors block py-0.5">Gift and Hampers</Link></li>
              <li><Link href="/categories/hospital-kit" className="hover:text-emerald-900 transition-colors block py-0.5">Hospital Kit</Link></li>
              <li><Link href="/categories/toys" className="hover:text-emerald-900 transition-colors block py-0.5">Toys</Link></li>
              <li><Link href="/categories" className="text-xs font-extrabold text-emerald-900 hover:underline block pt-1">View All Collections →</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 — HELP */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-lg text-slate-950">Help</h4>
            <ul className="space-y-2 text-sm lg:text-base text-slate-900 font-bold">
              <li><Link href="/about" className="hover:text-emerald-900 transition-colors block py-0.5">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-900 transition-colors block py-0.5">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-emerald-900 transition-colors block py-0.5">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-emerald-900 transition-colors block py-0.5">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-emerald-900 transition-colors block py-0.5">FAQs</Link></li>
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-lg text-slate-950">Contact</h4>
            <div className="space-y-3 text-sm lg:text-base text-slate-900 font-bold">
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-slate-950 shrink-0" />
                <a href={`https://wa.me/91${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-900 transition-colors font-bold">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-950 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-900 transition-colors font-bold">{settings.email}</a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-950 shrink-0 mt-1" />
                <address className="not-italic leading-relaxed font-bold text-slate-900">
                  Wandoor Road, Kanjirapadi<br />Pandikkad
                </address>
              </div>
            </div>
          </div>

        </div>

        {/* ── MOBILE/TABLET (< lg): Big logo + dropdown menus + contact row ── */}
        <div className="lg:hidden pb-8 sm:pb-10">
          {/* Logo + Tagline — centered, bigger */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <button
              onClick={handleScrollToTop}
              className="inline-block cursor-pointer group focus:outline-none"
              title="Click to scroll to top"
              aria-label="Baby Cry.in - Scroll to top"
              suppressHydrationWarning
            >
              <Image
                src="/images/babycry-logo-transparent.png"
                alt="Baby Cry.in"
                width={180}
                height={60}
                className="h-20 sm:h-24 w-auto object-contain group-hover:opacity-85 transition-opacity"
                priority
                suppressHydrationWarning
              />
            </button>
            <p className="mt-2 text-sm sm:text-base text-slate-900 font-bold">
              Little things for little ones.
            </p>
          </div>

          {/* Shop + Help — tap to open dropdown */}
          <div className="mb-6 sm:mb-8 border-t border-slate-400/40">
            {mobileMenus.map((menu) => {
              const isOpen = openMenu === menu.key;
              return (
                <div key={menu.key} className="border-b border-slate-400/40">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : menu.key)}
                    aria-expanded={isOpen}
                    aria-controls={`footer-menu-${menu.key}`}
                    className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none"
                  >
                    <span className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
                      {menu.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-950 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    id={`footer-menu-${menu.key}`}
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className={`overflow-hidden ${isOpen ? '' : 'invisible'}`}>
                      <ul className="pb-3 space-y-0.5 text-sm sm:text-base text-slate-900 font-bold">
                        {menu.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="hover:text-emerald-900 transition-colors block py-1.5">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                        {menu.extra && (
                          <li>
                            <Link href={menu.extra.href} className="text-xs sm:text-sm font-extrabold text-emerald-900 hover:underline block pt-1.5 pb-1">
                              {menu.extra.label}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact row — compact icons */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-900 font-bold mb-5 sm:mb-6">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
              <a href={`https://wa.me/91${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-900 transition-colors">{settings.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-emerald-900 transition-colors break-all">{settings.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
              <span>Wandoor Road, Kanjirapadi, Pandikkad</span>
            </div>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-4 text-slate-950">
            <a href={`https://instagram.com/${settings.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors" aria-label="Instagram">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors" aria-label="Facebook">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://pinterest.com/babycryin" target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors" aria-label="Pinterest">
              <PinterestIcon className="w-4 h-4" />
            </a>
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-emerald-900 transition-colors" aria-label="YouTube">
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-400/40 pt-4 sm:pt-6 flex flex-col items-center gap-2 text-[10px] sm:text-sm text-slate-900 font-bold">

          {/* Desktop: copyright + made with heart in a row */}
          <div className="hidden lg:flex w-full items-center justify-between">
            <p>© 2026 Baby Cry.in. All rights reserved.</p>
            <p className="flex items-center gap-1.5 font-bold">
              <span>Made with</span>
              <span className="text-red-600 text-sm">♥</span>
              <span>for little ones.</span>
            </p>
          </div>

          {/* Desktop: Ekodrix credit centered below — same size as footer text */}
          <p className="hidden lg:block font-bold">
            Crafted by{' '}
            <a
              href="https://ekodrix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-800 underline underline-offset-2 transition-colors"
            >
              Ekodrix
            </a>
          </p>

          {/* Mobile: copyright, made with ♥, then Ekodrix at the bottom */}
          <div className="lg:hidden flex flex-col items-center gap-1.5 text-center">
            <p>© 2026 Baby Cry.in. All rights reserved.</p>
            <p className="flex items-center gap-1.5 font-bold">
              <span>Made with</span>
              <span className="text-red-600 text-sm">♥</span>
              <span>for little ones.</span>
            </p>
            <p className="font-bold">
              Crafted by{' '}
              <a
                href="https://ekodrix.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-800 underline underline-offset-2 transition-colors"
              >
                Ekodrix
              </a>
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}