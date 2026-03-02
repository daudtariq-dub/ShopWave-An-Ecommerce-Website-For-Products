/**
 * Central mock data store — used by all mock API files while backend is offline.
 * Replace individual api/*.api.js files once the real backend is ready.
 */

export const MOCK_PRODUCTS = [
  { id: 1,  title: 'Wireless Noise-Cancelling Headphones Pro', price: 89.99,  category: 'electronics', image: null, description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design for travel.', rating: { rate: 4.5, count: 312 }, stock: 18 },
  { id: 2,  title: 'Mechanical Gaming Keyboard RGB', price: 64.95,  category: 'electronics', image: null, description: 'Tenkeyless mechanical keyboard with Cherry MX switches, per-key RGB lighting, and programmable macros.', rating: { rate: 4.3, count: 178 }, stock: 25 },
  { id: 3,  title: '4K Portable Monitor 15.6"', price: 219.00, category: 'electronics', image: null, description: 'Ultra-slim USB-C portable display with 4K resolution, HDR support, and built-in kickstand.', rating: { rate: 4.6, count: 94 },  stock: 7  },
  { id: 4,  title: 'Smart Fitness Tracker Band', price: 49.99,  category: 'electronics', image: null, description: 'Track steps, heart rate, sleep quality, and SpO2. 14-day battery, waterproof to 5 ATM.', rating: { rate: 4.1, count: 521 }, stock: 42 },

  { id: 5,  title: "Men's Classic Fit Oxford Shirt", price: 34.95,  category: 'clothing', image: null, description: '100% organic cotton oxford shirt. Tailored fit, button-down collar, available in 8 colours.', rating: { rate: 4.2, count: 87  }, stock: 5  },
  { id: 6,  title: "Women's Merino Wool Turtleneck", price: 59.00,  category: 'clothing', image: null, description: 'Ethically sourced merino wool. Ultra-soft, temperature-regulating, and machine washable.', rating: { rate: 4.7, count: 203 }, stock: 14 },
  { id: 7,  title: 'Slim-Fit Chino Trousers', price: 44.50,  category: 'clothing', image: null, description: 'Stretch-blend fabric with a modern slim silhouette. Wrinkle-resistant for all-day wear.', rating: { rate: 4.0, count: 66  }, stock: 31 },

  { id: 8,  title: 'Stainless Steel Water Bottle 32oz', price: 24.99,  category: 'home', image: null, description: 'Double-wall vacuum insulation keeps drinks cold 24h or hot 12h. Leak-proof lid, BPA-free.', rating: { rate: 4.7, count: 1204 }, stock: 99 },
  { id: 9,  title: 'Bamboo Cutting Board Set (3-piece)', price: 38.00,  category: 'home', image: null, description: 'Sustainably harvested bamboo in S/M/L sizes. Juice grooves, non-slip feet, dishwasher safe.', rating: { rate: 4.4, count: 432 }, stock: 55 },
  { id: 10, title: 'Aromatherapy Diffuser & Humidifier', price: 42.99,  category: 'home', image: null, description: '500ml ultrasonic diffuser with 7 LED colour modes, auto shut-off, and whisper-quiet operation.', rating: { rate: 4.3, count: 289 }, stock: 22 },

  { id: 11, title: 'Adjustable Dumbbell Set 20kg', price: 119.00, category: 'sports', image: null, description: 'Quick-adjust dial system from 2–20 kg in 2 kg increments. Replaces 10 pairs of dumbbells.', rating: { rate: 4.4, count: 563 }, stock: 0  },
  { id: 12, title: 'Yoga Mat — 6mm Non-Slip', price: 29.95,  category: 'sports', image: null, description: 'Eco-friendly TPE foam with alignment lines, carrying strap, and moisture-resistant surface.', rating: { rate: 4.6, count: 817 }, stock: 48 },
  { id: 13, title: 'Resistance Bands Set (5 levels)', price: 18.99,  category: 'sports', image: null, description: 'Latex-free fabric bands from extra-light to extra-heavy. Includes carry bag and workout guide.', rating: { rate: 4.5, count: 1103 }, stock: 3 },

  { id: 14, title: 'The Art of Clean Code — Paperback', price: 19.99,  category: 'books', image: null, description: 'A practical guide to writing readable, maintainable software. Covers naming, functions, tests, and refactoring.', rating: { rate: 4.8, count: 228 }, stock: 17 },
  { id: 15, title: 'Atomic Habits — James Clear', price: 14.99,  category: 'books', image: null, description: 'The life-changing million-copy #1 bestseller. Tiny changes, remarkable results.', rating: { rate: 4.9, count: 4812 }, stock: 60 },
  { id: 16, title: 'Deep Work — Cal Newport', price: 13.50,  category: 'books', image: null, description: 'Rules for focused success in a distracted world. Essential reading for knowledge workers.', rating: { rate: 4.7, count: 1987 }, stock: 29 },

  { id: 17, title: 'Vitamin C Brightening Serum 30ml', price: 42.50,  category: 'beauty', image: null, description: '15% L-ascorbic acid with vitamin E and ferulic acid. Reduces dark spots and boosts collagen.', rating: { rate: 4.3, count: 715 }, stock: 27 },
  { id: 18, title: 'Retinol Night Repair Cream', price: 55.00,  category: 'beauty', image: null, description: '0.5% encapsulated retinol with peptides and hyaluronic acid. Minimises fine lines overnight.', rating: { rate: 4.5, count: 392 }, stock: 11 },

  { id: 19, title: 'Gold-Plated Hoop Earrings Set', price: 67.00,  category: 'jewelery', image: null, description: '18k gold-plated sterling silver in three sizes. Hypoallergenic, tarnish-resistant.', rating: { rate: 4.1, count: 91  }, stock: 11 },
  { id: 20, title: 'Minimalist Signet Ring — Silver', price: 89.00,  category: 'jewelery', image: null, description: '925 sterling silver with brushed finish. Stackable, unisex design.', rating: { rate: 4.4, count: 57  }, stock: 8  },

  { id: 21, title: 'LEGO Architecture City Kit 480pcs', price: 54.95,  category: 'toys', image: null, description: 'Build iconic city landmarks with this 480-piece set. Includes skyline display stand. Ages 12+.', rating: { rate: 4.9, count: 442 }, stock: 8  },
  { id: 22, title: 'Remote Control Off-Road Truck 4WD', price: 39.99,  category: 'toys', image: null, description: 'All-terrain RC truck with independent suspension, 30mph top speed, rechargeable battery.', rating: { rate: 4.3, count: 286 }, stock: 19 },
];

export const MOCK_CATEGORIES = [
  'electronics', 'clothing', 'home', 'sports', 'books', 'beauty', 'jewelery', 'toys',
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    total: 124.94,
    items: [
      { productId: 1, title: 'Wireless Noise-Cancelling Headphones Pro', quantity: 1, price: 89.99 },
      { productId: 8, title: 'Stainless Steel Water Bottle 32oz',         quantity: 1, price: 24.99 },
    ],
  },
  {
    id: 'ORD-002',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    total: 59.00,
    items: [
      { productId: 6, title: "Women's Merino Wool Turtleneck", quantity: 1, price: 59.00 },
    ],
  },
];

/** Simulate async latency so UI loading states are visible */
export const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));
