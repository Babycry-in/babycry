'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from './SearchModal';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { Category, BusinessSettings } from '@/types/database';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  categories: Category[];
  settings: BusinessSettings;
}

export function Header({ categories, settings }: HeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const pathname = usePathname();

  // Hide main store header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Brand Logo */}
            <div className="shrink-0 flex items-center">
              <Logo size="md" />
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-sm font-medium py-3 transition-colors cursor-pointer ${
                    isMegaMenuOpen ? 'text-emerald-700 font-semibold' : 'text-slate-800 hover:text-emerald-700'
                  }`}
                >
                  <span>Shop All</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isMegaMenuOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              <Link href="/categories/apparels" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors">
                Apparels
              </Link>
              <Link href="/categories/footwear" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors">
                Footwear
              </Link>
              <Link href="/categories/accessories" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors">
                Accessories
              </Link>
              <Link href="/categories/gift-and-hampers" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors">
                Gift &amp; Hampers
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-slate-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50/80 transition-colors"
                aria-label="Search items"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 text-slate-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50/80 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 text-slate-700 hover:text-emerald-800 rounded-full hover:bg-emerald-50/80 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 text-slate-700 hover:text-emerald-700 rounded-full hover:bg-emerald-50 lg:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          categories={categories}
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>

      {/* Slide-out Mobile Menu */}
      <MobileMenu
        categories={categories}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        phone={settings.phone}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
