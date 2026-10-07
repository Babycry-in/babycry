import { BusinessSettings, Category, HeroSlide, HomepageSection, Product } from '@/types/database';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  id: 'b8c80000-0000-4000-8000-000000000001',
  business_name: 'Baby Cry.in',
  tagline: 'Little things for brighter little days',
  phone: '8136 819192',
  whatsapp_number: '8136819192',
  email: 'babycry.inbc@gmail.com',
  address: 'Pandikkad, Wandoor Road, Kanjirapadi',
  instagram_handle: 'Baby_cry.in',
  facebook_url: 'https://facebook.com/babycry.in',
  youtube_url: 'https://youtube.com/@babycryin',
  logo_url: '/images/babycry-logo.png',
  free_shipping_threshold: 999,
  standard_delivery_fee: 99,
  whatsapp_order_template: `*{business_name}*
🛍️ *NEW ORDER*

*Order ID:*
{order_id}

*Customer:*
{customer_name}

*Phone:*
{customer_phone}

*Delivery Address:*
{delivery_address}

*Products:*
{products}

*Subtotal:* {subtotal}
*Delivery:* {delivery}
*TOTAL:* {total}

*Order Status:* {order_status}`,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Apparels',
    slug: 'apparels',
    short_description: 'Soft organic cotton rompers, dresses, and comfy daily wear',
    image_url: '/uploads/Overlapping Kids’ Outfits in Cream and Pastels-1791023861821-901315992.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 1,
    is_active: true,
    seo_title: 'Baby & Kids Apparels | Baby Cry.in',
    seo_description: 'Discover super-soft organic baby clothes, rompers, and dresses for little ones.'
  },
  {
    id: 'c0000001-0000-4000-8000-000000000002',
    name: 'Footwear',
    slug: 'footwear',
    short_description: 'Gentle pre-walkers, cozy booties, and comfy shoes',
    image_url: '/uploads/Kids’ Pink and Blue Sneaker Collection-1791193419460-722245963.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000003',
    name: 'Accessories',
    slug: 'accessories',
    short_description: 'Cute beanies, bibs, mittens, and headbands',
    image_url: '/uploads/Pastel Bunny Kids’ Accessory Collection-1791193508027-132372465.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000004',
    name: 'Gift & Hampers',
    slug: 'gift-and-hampers',
    short_description: 'Beautifully boxed gift bundles for baby showers & celebrations',
    image_url: '/uploads/Pastel Gift Collection with Teddy Bear-1791193534235-168019494.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000005',
    name: 'Hospital Kit',
    slug: 'hospital-kit',
    short_description: 'Essential newborn arrival kits with sterilized maternity care',
    image_url: '/uploads/Pastel Baby Hospital Kit Essentials-1791194553831-366964051.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000006',
    name: 'Toys',
    slug: 'toys',
    short_description: 'Sensory plushies, wooden rattles, and developmental playsets',
    image_url: '/uploads/Adorable Toytime Friends-1791194463524-902518026.webp',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 6,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000007',
    name: 'Diapering',
    slug: 'diapering',
    short_description: 'Breathable cloth diapers, changing mats, and wet wipes',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 7,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000008',
    name: 'Bath & Skin Care',
    slug: 'bath-and-skin-care',
    short_description: 'Gentle tear-free cleansers, soft towels, and nourishing oils',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 8,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000009',
    name: 'Baby Gear',
    slug: 'baby-gear',
    short_description: 'Compact strollers, ergonomic carriers, and travel bags',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 9,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000010',
    name: 'Feeding',
    slug: 'feeding',
    short_description: 'BPA-free suction bowls, training cups, silicone spoons & highchairs',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 10,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000011',
    name: 'Nursery',
    slug: 'nursery',
    short_description: 'Soft crib bedding, calming night lights, and storage baskets',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 11,
    is_active: true,
  },
  {
    id: 'c0000001-0000-4000-8000-000000000012',
    name: 'Health & Safety',
    slug: 'health-and-safety',
    short_description: 'Nail trimmers, nasal aspirators, safety locks & monitors',
    image_url: '',
    banner_url: '',
    mobile_banner_url: '',
    display_order: 12,
    is_active: true,
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'h0000001-0000-4000-8000-000000000001',
    eyebrow: 'LITTLE THINGS FOR',
    title: 'Brighter Little Days',
    description: 'Cute outfits, thoughtful essentials and little toys for your little one.',
    primary_cta_text: 'Shop the Collection',
    primary_cta_url: '/categories/apparels',
    secondary_cta_text: 'Explore New Arrivals',
    secondary_cta_url: '/categories',
    desktop_image: '/uploads/ChatGPT Image Oct 2, 2026, 05_55_15 PM-1790943937695-631678435.webp',
    mobile_image: '/uploads/ChatGPT Image Oct 2, 2026, 05_55_15 PM-1790943937695-631678435.webp',
    is_active: true,
    sort_order: 1
  }
];

// Empty products array so only products added by admin will appear
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 's0000001-0000-4000-8000-000000000001',
    section_key: 'sweetest_details',
    title: 'The sweetest little details.',
    subtitle: 'GIRLS EDIT',
    description: 'Adorable styles made for tiny personalities and big little moments.',
    cta_text: 'Shop Girlswear',
    cta_url: '/categories/apparels',
    image_url: '',
    is_active: true,
    display_order: 1
  },
  {
    id: 's0000001-0000-4000-8000-000000000002',
    section_key: 'little_looks',
    title: 'Little looks worth saving.',
    subtitle: 'CUTE & DREAMY',
    description: 'Cute, dreamy and effortlessly stylish.',
    cta_text: 'Explore Looks',
    cta_url: '/categories/apparels',
    image_url: '',
    is_active: true,
    display_order: 2,
    metadata: {
      looks: []
    }
  },
  {
    id: 's0000001-0000-4000-8000-000000000003',
    section_key: 'mealtime',
    title: 'Mealtime made a little happier.',
    description: 'Give your little one a comfortable space to enjoy every bite with our ergonomic highchairs & silicone dining sets.',
    cta_text: 'Explore Feeding',
    cta_url: '/categories/feeding',
    image_url: '',
    is_active: true,
    display_order: 3,
    metadata: {
      bullet_1: 'Comfortable seating & posture',
      bullet_2: 'Sturdy & tip-resistant design',
      bullet_3: 'Easy to wipe clean'
    }
  },
  {
    id: 's0000001-0000-4000-8000-000000000004',
    section_key: 'tiny_teeth',
    title: 'Tiny teeth. Tiny discoveries.',
    description: 'A little extra comfort for those teething days.',
    cta_text: 'Shop Baby Essentials',
    cta_url: '/categories/toys',
    image_url: '',
    is_active: true,
    display_order: 4
  },
  {
    id: 's0000001-0000-4000-8000-000000000005',
    section_key: 'travel',
    title: 'The sweetest little details.',
    subtitle: 'APPARELS EDIT',
    description: 'Adorable styles made for tiny personalities and big little moments.',
    cta_text: 'Shop Apparels',
    cta_url: '/categories/apparels',
    image_url: '',
    is_active: true,
    display_order: 5
  },
  {
    id: 's0000001-0000-4000-8000-000000000006',
    section_key: 'gift_box',
    title: 'A little love, packed with care.',
    description: 'Beautifully curated newborn essentials for baby showers, newborn welcomes and special occasions.',
    cta_text: 'Explore Gift Boxes',
    cta_url: '/categories/gift-and-hampers',
    image_url: '/images/Dreamy-bg(1)copy.png',
    is_active: true,
    display_order: 6
  },
  {
    id: 's0000001-0000-4000-8000-000000000007',
    section_key: 'unboxing',
    title: 'Unbox the cuteness.',
    description: 'A little love packed into every order.',
    cta_text: 'Our Packaging ♡',
    cta_url: '/about',
    image_url: '/images/packaging-banner.png',
    is_active: true,
    display_order: 7
  },
  {
    id: 's0000001-0000-4000-8000-000000000008',
    section_key: 'instagram',
    title: 'Little moments @Baby_cry.in',
    subtitle: 'INSTAGRAM COMMUNITY',
    description: 'Tag us in your cutest baby moments to get featured!',
    cta_text: 'Follow Along',
    cta_url: 'https://instagram.com/Baby_cry.in',
    image_url: '',
    is_active: true,
    display_order: 8,
    metadata: {
      images: []
    }
  }
];
