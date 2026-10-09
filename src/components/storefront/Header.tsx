'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from './SearchModal';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { Category, Subcategory, BusinessSettings } from '@/types/database';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
} from 'lucide-react';

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

interface HeaderProps {
  categories: CategoryWithSubs[];
  settings: BusinessSettings;
}

export function Header({ categories, settings }: HeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const pathname = usePathname();

  // Close menus on route change
  React.useEffect(() => {
    setIsMegaMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Keyboard navigation & accessibility (ESC to close)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide main store header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(null);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 180);
  };

  const handleCatEnter = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(false);
    setOpenDropdown(id);
  };

  const handleCatLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  };

  // Limit to first 5 categories in top nav for space, rest go in mega menu
  const navCategories = categories.slice(0, 5);

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
            <nav className="hidden lg:flex items-center gap-1">
              {/* Shop All mega menu */}
              <div
                className="relative"
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  onFocus={handleMegaMenuEnter}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-3 transition-colors cursor-pointer ${
                    isMegaMenuOpen ? 'text-emerald-700 font-semibold' : 'text-slate-800 hover:text-emerald-700'
                  }`}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Shop All</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isMegaMenuOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Per-category nav items with subcategory dropdown */}
              {navCategories.map((cat) => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isOpen = openDropdown === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => (hasSubs ? handleCatEnter(cat.id) : undefined)}
                    onMouseLeave={hasSubs ? handleCatLeave : undefined}
                  >
                    <Link
                      href={`/categories/${cat.slug}`}
                      onFocus={() => (hasSubs ? handleCatEnter(cat.id) : undefined)}
                      className={`flex items-center gap-1 text-sm font-medium px-3 py-3 transition-colors ${
                        pathname === `/categories/${cat.slug}`
                          ? 'text-emerald-700 font-semibold'
                          : 'text-slate-700 hover:text-emerald-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {hasSubs && (
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </Link>

                    {/* Subcategory Dropdown with zero-gap hover bridge */}
                    {hasSubs && (
                      <div
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleCatLeave}
                        className={`absolute top-full left-0 pt-1.5 w-52 z-50 transition-all duration-200 origin-top ${
                          isOpen
                            ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto visible'
                            : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none invisible'
                        }`}
                        role="menu"
                        aria-label={`${cat.name} subcategories`}
                      >
                        <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl py-2 overflow-hidden">
                          <Link
                            href={`/categories/${cat.slug}`}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                            role="menuitem"
                          >
                            All {cat.name}
                          </Link>
                          <div className="h-px bg-emerald-50 mx-3 my-1" />
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${cat.slug}?sub=${sub.slug}`}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-800 transition-colors"
                              role="menuitem"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
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
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
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
