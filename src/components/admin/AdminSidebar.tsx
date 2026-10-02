'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Sparkles,
  Image as ImageIcon,
  Settings,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

import { InstagramIcon } from '@/components/ui/SocialIcons';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Homepage Builder', href: '/admin/homepage', icon: Sparkles },
    { label: 'Hero Slide', href: '/admin/homepage/hero', icon: Sparkles },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Instagram Settings', href: '/admin/settings/instagram', icon: InstagramIcon },
    { label: 'Business Settings', href: '/admin/settings/business', icon: Settings },
    { label: 'WhatsApp Settings', href: '/admin/settings/whatsapp', icon: MessageCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-slate-100 bg-[#FAF7F2]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
