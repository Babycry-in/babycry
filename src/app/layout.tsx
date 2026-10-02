import type { Metadata } from 'next';
import { Fredoka, Quicksand } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getBusinessSettings, getCategories } from '@/lib/data/db-service';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBusinessSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${settings.business_name} | Little Things for Brighter Little Days`,
      template: `%s | ${settings.business_name}`,
    },
    description:
      'Baby & Kids Fashion, Footwear, Accessories, Hospital Kits, Toys, Diapering & Gift Hampers in Kerala, India.',
    keywords: [
      'Baby Cry.in',
      'Baby clothing',
      'Kids fashion',
      'Baby gift hamper',
      'Hospital kit',
      'Baby essentials',
      'Organic cotton baby wear',
      'Kerala baby store',
    ],
    openGraph: {
      title: `${settings.business_name} | Little Things for Brighter Little Days`,
      description: 'Cute outfits, thoughtful essentials and little toys for your little one.',
      images: [
        {
          url: settings.logo_url || '/images/babycry-logo.png',
          width: 800,
          height: 300,
          alt: settings.business_name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.business_name,
      description: 'Little things for brighter little days.',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  const settings = await getBusinessSettings();

  return (
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <CartProvider>
          <WishlistProvider>
            <Header categories={categories} settings={settings} />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
