import type { Metadata } from 'next';
import { Fredoka, Quicksand } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getBusinessSettings, getCategoriesWithSubcategories } from '@/lib/data/db-service';

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

const SITE_URL = 'https://www.babycry.in';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBusinessSettings();
  return {
    metadataBase: new URL(SITE_URL),
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
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SITE_URL,
      siteName: 'BabyCry.in',
      title: `${settings.business_name} | Little Things for Brighter Little Days`,
      description: 'Cute outfits, thoughtful essentials and little toys for your little one.',
      images: [
        {
          url: `${SITE_URL}/images/babycry-logo.png`,
          width: 1200,
          height: 630,
          alt: settings.business_name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.business_name,
      description: 'Little things for brighter little days.',
      images: [`${SITE_URL}/images/babycry-logo.png`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategoriesWithSubcategories();
  const settings = await getBusinessSettings();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'OnlineStore'],
    '@id': `${SITE_URL}/#organization`,
    name: settings.business_name || 'Baby Cry.in',
    url: SITE_URL,
    logo: `${SITE_URL}/images/babycry-logo.png`,
    description: 'Baby & Kids Fashion, Footwear, Accessories, Hospital Kits, Toys, Diapering & Gift Hampers in Kerala, India.',
    telephone: settings.phone ? `+91${settings.phone.replace(/[^0-9]/g, '')}` : undefined,
    email: settings.email || undefined,
    address: settings.address ? {
      '@type': 'PostalAddress',
      streetAddress: 'Wandoor Road, Kanjirapadi',
      addressLocality: 'Pandikkad',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    } : undefined,
    sameAs: [
      settings.instagram_handle ? `https://instagram.com/${settings.instagram_handle}` : null,
      settings.facebook_url || null,
      settings.youtube_url || null,
    ].filter(Boolean),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'BabyCry.in',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  return (
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
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
