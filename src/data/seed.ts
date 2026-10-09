import { Store, Product, Category, Order, User, Membership, StoreTheme } from '../types';

export const PREDEFINED_CATEGORIES = [
  'T-Shirts',
  'Jeans',
  'Shoes',
  'Watches',
  'Headphones',
  'Mobiles',
  'Laptops',
  'Snacks',
  'Beverages',
  'Skincare',
  'Home Decor',
  'Books',
  'Sports Gear',
  'Toys'
] as const;

export const THEMES: StoreTheme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean monochrome aesthetics with sleek border discipline and typography.',
    primaryColor: '#0f172a',
    accentColor: '#475569',
    fontFamily: 'Inter',
    cardStyle: 'bordered',
    bannerBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-energy modern storefront with punchy contrast and vibrant accents.',
    primaryColor: '#4f46e5',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    cardStyle: 'elevated',
    bannerBg: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Luxury editorial finish with warm gold, deep obsidian, and refined serif type.',
    primaryColor: '#1c1917',
    accentColor: '#d97706',
    fontFamily: 'Georgia',
    cardStyle: 'flat',
    bannerBg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)'
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Vibrant, refreshing color scheme with modern cyan accents and clean feel.',
    primaryColor: '#0d9488',
    accentColor: '#0284c7',
    fontFamily: 'system-ui',
    cardStyle: 'bordered',
    bannerBg: 'linear-gradient(135deg, #115e59 0%, #0d9488 50%, #06b6d4 100%)'
  }
];

export const DEMO_USER: User = {
  id: 'usr_owner_demo',
  email: 'owner@demo.com',
  name: 'Aarav Mehta',
  passwordHash: 'demo123',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: new Date('2026-01-10').toISOString()
};

export const DEMO_STORE: Store = {
  id: 'str_cypher_urban',
  slug: 'cypher-urban',
  name: 'Cypher Urban Apparel',
  logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
  email: 'contact@cypherurban.in',
  phone: '+91 98765 43210',
  address: '42 Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
  businessType: 'Fashion & Apparel',
  currency: 'INR',
  themeId: 'bold',
  primaryColor: '#4f46e5',
  accentColor: '#f59e0b',
  fontFamily: 'Inter',
  footerText: 'Crafted for modern urban explorers. Express shipping across India.',
  createdAt: new Date('2026-02-01').toISOString(),
  updatedAt: new Date('2026-02-15').toISOString()
};

export const DEMO_MEMBERSHIP: Membership = {
  userId: DEMO_USER.id,
  storeId: DEMO_STORE.id,
  role: 'OWNER'
};

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat_tshirts', storeId: DEMO_STORE.id, name: 'T-Shirts', slug: 't-shirts' },
  { id: 'cat_jeans', storeId: DEMO_STORE.id, name: 'Jeans', slug: 'jeans' },
  { id: 'cat_shoes', storeId: DEMO_STORE.id, name: 'Shoes', slug: 'shoes' },
  { id: 'cat_watches', storeId: DEMO_STORE.id, name: 'Watches', slug: 'watches' }
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_tshirts',
    categoryName: 'T-Shirts',
    name: 'Heavyweight Oversized Cotton Tee',
    slug: 'heavyweight-oversized-cotton-tee',
    description: '280 GSM heavyweight French terry cotton. Boxy drop-shoulder cut designed for everyday comfort.',
    price: 1499,
    comparePrice: 1999,
    discountPct: 25,
    stock: 45,
    sku: 'CYP-TEE-01',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-02').toISOString()
  },
  {
    id: 'prod_2',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_tshirts',
    categoryName: 'T-Shirts',
    name: 'Vintage Washed Graphic Tee - Noir',
    slug: 'vintage-washed-graphic-tee-noir',
    description: 'Pigment-dyed vintage black finish with subtle distressed collar and screen-printed cyber glyph.',
    price: 1299,
    comparePrice: 1799,
    discountPct: 28,
    stock: 6, // Low stock alert!
    sku: 'CYP-TEE-02',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-03').toISOString()
  },
  {
    id: 'prod_3',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_jeans',
    categoryName: 'Jeans',
    name: 'Raw Selvedge Denim - Straight Leg',
    slug: 'raw-selvedge-denim-straight-leg',
    description: '14.5oz Japanese shuttle-loom denim. Deep indigo wash designed to fade uniquely to your lifestyle.',
    price: 3499,
    comparePrice: 4499,
    discountPct: 22,
    stock: 18,
    sku: 'CYP-JNS-01',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-04').toISOString()
  },
  {
    id: 'prod_4',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_shoes',
    categoryName: 'Shoes',
    name: 'Monochrome Low-Top Leather Sneakers',
    slug: 'monochrome-low-top-leather-sneakers',
    description: 'Italian nappa leather upper with vulcanized rubber sole and memory foam cushioned insoles.',
    price: 4999,
    comparePrice: 6499,
    discountPct: 23,
    stock: 4, // Low stock alert!
    sku: 'CYP-SHOE-01',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-05').toISOString()
  },
  {
    id: 'prod_5',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_watches',
    categoryName: 'Watches',
    name: 'Minimalist Matte Black Chronograph',
    slug: 'minimalist-matte-black-chronograph',
    description: 'Sapphire crystal glass, Japanese quartz movement, 5ATM water resistance with genuine leather strap.',
    price: 6999,
    comparePrice: 8999,
    discountPct: 22,
    stock: 12,
    sku: 'CYP-WTC-01',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-06').toISOString()
  },
  {
    id: 'prod_6',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_shoes',
    categoryName: 'Shoes',
    name: 'Chelsea Boots in Oiled Nubuck',
    slug: 'chelsea-boots-in-oiled-nubuck',
    description: 'Water-resistant oiled nubuck with elasticated side gussets and Goodyear welted rubber soles.',
    price: 5499,
    comparePrice: 7200,
    discountPct: 24,
    stock: 0, // Out of stock!
    sku: 'CYP-SHOE-02',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-07').toISOString()
  },
  {
    id: 'prod_7',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_jeans',
    categoryName: 'Jeans',
    name: 'Relaxed Tapered Washed Blue Denim',
    slug: 'relaxed-tapered-washed-blue-denim',
    description: 'Mid-rise relaxed fit with gentle taper. 12oz stretch denim with vintage fade whiskering.',
    price: 2799,
    comparePrice: 3499,
    discountPct: 20,
    stock: 22,
    sku: 'CYP-JNS-02',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-08').toISOString()
  },
  {
    id: 'prod_8',
    storeId: DEMO_STORE.id,
    categoryId: 'cat_watches',
    categoryName: 'Watches',
    name: 'Automatic Skeleton Titanium Watch',
    slug: 'automatic-skeleton-titanium-watch',
    description: 'Exposed balance wheel, aerospace-grade titanium casing, and 42-hour power reserve.',
    price: 12499,
    comparePrice: 15999,
    discountPct: 22,
    stock: 5, // Low stock alert!
    sku: 'CYP-WTC-02',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    createdAt: new Date('2026-02-09').toISOString()
  }
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'ord_101',
    storeId: DEMO_STORE.id,
    orderNumber: 'ORD-94821',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98201 12345',
    shippingAddress: 'Flat 402, Sunset Heights, Bandra West, Mumbai, Maharashtra 400050',
    subtotal: 6498,
    total: 6498,
    status: 'PLACED',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    items: [
      {
        id: 'item_1',
        orderId: 'ord_101',
        productId: 'prod_1',
        name: 'Heavyweight Oversized Cotton Tee',
        price: 1499,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'item_2',
        orderId: 'ord_101',
        productId: 'prod_4',
        name: 'Monochrome Low-Top Leather Sneakers',
        price: 4999,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'ord_102',
    storeId: DEMO_STORE.id,
    orderNumber: 'ORD-94820',
    customerName: 'Rohan Deshmukh',
    customerEmail: 'rohan.d@example.com',
    customerPhone: '+91 97654 88990',
    shippingAddress: 'House 18, 4th Cross, Koramangala 5th Block, Bengaluru, Karnataka 560095',
    subtotal: 6999,
    total: 6999,
    status: 'PACKED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    items: [
      {
        id: 'item_3',
        orderId: 'ord_102',
        productId: 'prod_5',
        name: 'Minimalist Matte Black Chronograph',
        price: 6999,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'ord_103',
    storeId: DEMO_STORE.id,
    orderNumber: 'ORD-94819',
    customerName: 'Ananya Verma',
    customerEmail: 'ananya.v@example.com',
    customerPhone: '+91 99112 33445',
    shippingAddress: 'B-12, Green Park Main, New Delhi 110016',
    subtotal: 4798,
    total: 4798,
    status: 'SHIPPED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    items: [
      {
        id: 'item_4',
        orderId: 'ord_103',
        productId: 'prod_2',
        name: 'Vintage Washed Graphic Tee - Noir',
        price: 1299,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'item_5',
        orderId: 'ord_103',
        productId: 'prod_3',
        name: 'Raw Selvedge Denim - Straight Leg',
        price: 3499,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'ord_104',
    storeId: DEMO_STORE.id,
    orderNumber: 'ORD-94818',
    customerName: 'Vikram Joshi',
    customerEmail: 'vikram.j@example.com',
    customerPhone: '+91 94432 11223',
    shippingAddress: '88 Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033',
    subtotal: 12499,
    total: 12499,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    items: [
      {
        id: 'item_6',
        orderId: 'ord_104',
        productId: 'prod_8',
        name: 'Automatic Skeleton Titanium Watch',
        price: 12499,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'ord_105',
    storeId: DEMO_STORE.id,
    orderNumber: 'ORD-94817',
    customerName: 'Karan Sen',
    customerEmail: 'karan.sen@example.com',
    customerPhone: '+91 98300 44556',
    shippingAddress: '15/2 Ballygunge Circular Rd, Kolkata, West Bengal 700019',
    subtotal: 2799,
    total: 2799,
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    items: [
      {
        id: 'item_7',
        orderId: 'ord_105',
        productId: 'prod_7',
        name: 'Relaxed Tapered Washed Blue Denim',
        price: 2799,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const DUMMY_PRODUCTS_BY_CATEGORY: Record<string, Array<{
  name: string;
  description: string;
  price: number;
  comparePrice: number;
  stock: number;
  image: string;
}>> = {
  'T-Shirts': [
    {
      name: 'Heavyweight Drop Shoulder Tee',
      description: '100% combed cotton, 260 GSM fabric. Relaxed everyday fit.',
      price: 1299,
      comparePrice: 1699,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Essential Organic Crewneck Tee',
      description: 'GOTS certified organic cotton, ultra-soft and pre-shrunk.',
      price: 999,
      comparePrice: 1299,
      stock: 8, // Low stock
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Jeans': [
    {
      name: 'Classic Selvedge Indigo Denim',
      description: 'Durable 13.5oz vintage washed raw denim with redline selvedge ID.',
      price: 3299,
      comparePrice: 4299,
      stock: 24,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Slim Tapered Stretch Jeans',
      description: 'Comfort stretch denim in washed charcoal tone with branded hardware.',
      price: 2499,
      comparePrice: 3199,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Shoes': [
    {
      name: 'Premium Court White Leather Sneakers',
      description: 'Full-grain calfskin leather with padded collar and durable rubber cupsole.',
      price: 4499,
      comparePrice: 5999,
      stock: 14,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Urban Trail Running Shoes',
      description: 'Responsive foam midsole with breathable mesh upper and vibram grip.',
      price: 3999,
      comparePrice: 4999,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Watches': [
    {
      name: 'Chronograph Steel Mesh Watch',
      description: 'Sunray dial, scratch-resistant mineral crystal, water resistant 30m.',
      price: 5999,
      comparePrice: 7499,
      stock: 11,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Minimalist Bauhaus Leather Watch',
      description: 'Clean dial indices with slim 7mm casing and genuine calf leather band.',
      price: 4999,
      comparePrice: 6299,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Headphones': [
    {
      name: 'Active Noise Cancelling Wireless Headphones',
      description: '40mm custom drivers, 45-hour battery life with hybrid active noise cancellation.',
      price: 8999,
      comparePrice: 11999,
      stock: 19,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'True Wireless Studio Earbuds',
      description: 'IPX5 water resistance, wireless Qi charging case and ultra-low latency mode.',
      price: 3499,
      comparePrice: 4999,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Mobiles': [
    {
      name: 'Aero X Pro 5G Flagship Phone',
      description: '6.7 inch 120Hz AMOLED, 50MP Sony sensor, 5000mAh battery with 80W fast charge.',
      price: 34999,
      comparePrice: 39999,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Laptops': [
    {
      name: 'Zenith Ultra Thin 14-inch Laptop',
      description: 'Aluminum unibody, 16GB LPDDR5 RAM, 1TB NVMe SSD, 16-hour battery life.',
      price: 64999,
      comparePrice: 72999,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Snacks': [
    {
      name: 'Artisanal Roasted Almond & Cranberry Mix',
      description: 'Slow-roasted Californian almonds with dried cranberries and Himalayan pink salt.',
      price: 449,
      comparePrice: 599,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Beverages': [
    {
      name: 'Single Origin Cold Brew Concentrate',
      description: 'Ethiopian Yirgacheffe beans steeped cold for 24 hours. Floral and citrus notes.',
      price: 599,
      comparePrice: 750,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Skincare': [
    {
      name: 'Botanical Hydrating Barrier Serum',
      description: 'Hyaluronic acid complex, centella asiatica, and ceramide NP for deep barrier repair.',
      price: 1299,
      comparePrice: 1599,
      stock: 22,
      image: 'https://images.unsplash.com/photo-1608248597359-bbcf3e840d7c?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Home Decor': [
    {
      name: 'Ceramic Fluted Arch Vase',
      description: 'Handcrafted stoneware with matte textured unglazed finish for dried flora.',
      price: 1799,
      comparePrice: 2299,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Books': [
    {
      name: 'Design Systems for the Modern Web',
      description: 'Hardcover edition. Principles of scalable component architecture and UI tokens.',
      price: 1499,
      comparePrice: 1899,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Sports Gear': [
    {
      name: 'Pro Grip Natural Rubber Yoga Mat',
      description: '4.5mm thickness, non-slip textured polyurethane surface with laser-etched alignment lines.',
      price: 2499,
      comparePrice: 3200,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Toys': [
    {
      name: 'Wooden Architectural Block Set',
      description: 'FSC-certified beechwood building blocks with non-toxic water-based finishes.',
      price: 1899,
      comparePrice: 2399,
      stock: 16,
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

export function generateDummyProductsForCategories(
  storeId: string,
  categories: Category[]
): Product[] {
  const products: Product[] = [];
  let index = 1;

  for (const cat of categories) {
    const samples = DUMMY_PRODUCTS_BY_CATEGORY[cat.name] || [
      {
        name: `Premium ${cat.name} Item`,
        description: `Handcrafted quality item in our ${cat.name} collection. Durable materials and modern design.`,
        price: 1299,
        comparePrice: 1699,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const sample of samples) {
      const slug = sample.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      products.push({
        id: `prod_${storeId}_${index}`,
        storeId,
        categoryId: cat.id,
        categoryName: cat.name,
        name: sample.name,
        slug: `${slug}-${index}`,
        description: sample.description,
        price: sample.price,
        comparePrice: sample.comparePrice,
        discountPct: Math.round(((sample.comparePrice - sample.price) / sample.comparePrice) * 100),
        stock: sample.stock,
        sku: `SKU-${cat.name.slice(0, 3).toUpperCase()}-${String(index).padStart(3, '0')}`,
        image: sample.image,
        isActive: true,
        createdAt: new Date().toISOString()
      });
      index++;
    }
  }

  return products;
}
