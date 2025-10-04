require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Enhanced artwork/candle listing with categories and badges
const artworks = [
  // ===== NEW ARRIVALS (Recent products - last 30 days) =====
  { 
    id: 1, 
    title: 'Lavender Dreams Pillar', 
    description: 'Hand-poured lavender scented pillar candle with natural soy wax',
    price: 89900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    category: 'pillar',
    badges: ['new'],
    featured: false,
    createdAt: new Date('2025-10-01')
  },
  { 
    id: 2, 
    title: 'Ocean Breeze Premium Jar', 
    description: 'Refreshing ocean scent in elegant glass jar with wooden lid',
    price: 124900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'premium-scented',
    badges: ['new', 'bestseller'],
    featured: false,
    createdAt: new Date('2025-09-28')
  },
  { 
    id: 3, 
    title: 'Rose Gold Luxury Gift Set', 
    description: 'Premium gift set with 3 rose-scented candles in rose gold holders',
    price: 249900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'gift-sets',
    badges: ['new', 'limited-edition'],
    featured: false,
    createdAt: new Date('2025-10-03')
  },
  { 
    id: 4, 
    title: 'Peppermint Twist Pillar', 
    description: 'Cool and refreshing peppermint scent in classic pillar form',
    price: 79900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'pillar',
    badges: ['new'],
    featured: false,
    createdAt: new Date('2025-10-04')
  },
  { 
    id: 5, 
    title: 'Golden Hour Signature', 
    description: 'Warm amber and vanilla blend - our newest signature scent',
    price: 169900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'signature',
    badges: ['new', 'signature'],
    featured: true,
    createdAt: new Date('2025-10-02')
  },
  { 
    id: 6, 
    title: 'Festive Spice Collection', 
    description: 'Limited edition festive blend with cinnamon, clove & orange',
    price: 159900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'premium-scented',
    badges: ['new', 'limited-edition'],
    featured: false,
    createdAt: new Date('2025-09-30')
  },
  { 
    id: 7, 
    title: 'Eucalyptus Mint Wellness', 
    description: 'Spa-inspired eucalyptus and mint for ultimate relaxation',
    price: 99900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    category: 'pillar',
    badges: ['new'],
    featured: false,
    createdAt: new Date('2025-10-05')
  },
  
  // ===== BESTSELLERS (Most popular products) =====
  { 
    id: 8, 
    title: 'Vanilla Bean Delight', 
    description: 'Classic vanilla scent in artisan ceramic bowl - customer favorite',
    price: 99900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'signature',
    badges: ['bestseller'],
    featured: true,
    createdAt: new Date('2025-08-15')
  },
  { 
    id: 9, 
    title: 'Cinnamon Spice Pillar', 
    description: 'Warm cinnamon fragrance perfect for cozy evenings',
    price: 79900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    category: 'pillar',
    badges: ['bestseller'],
    featured: false,
    createdAt: new Date('2025-07-20')
  },
  { 
    id: 10, 
    title: 'Amber Noir Collection', 
    description: 'Sophisticated amber scent in black matte jar',
    price: 149900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'premium-scented',
    badges: ['bestseller'],
    featured: true,
    createdAt: new Date('2025-06-10')
  },
  { 
    id: 11, 
    title: 'French Lavender Dreams', 
    description: 'Best-selling French lavender in premium glass container',
    price: 119900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'premium-scented',
    badges: ['bestseller'],
    featured: false,
    createdAt: new Date('2025-05-25')
  },
  { 
    id: 12, 
    title: 'Coffee House Blend', 
    description: 'Rich espresso and hazelnut - our most requested scent',
    price: 109900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'signature',
    badges: ['bestseller', 'signature'],
    featured: true,
    createdAt: new Date('2025-04-10')
  },
  { 
    id: 13, 
    title: 'Sea Salt & Sage', 
    description: 'Coastal-inspired scent loved by thousands',
    price: 129900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'premium-scented',
    badges: ['bestseller'],
    featured: false,
    createdAt: new Date('2025-03-15')
  },
  { 
    id: 14, 
    title: 'Winter Wonderland Gift Set', 
    description: 'Our #1 gift set - pine, cedar & vanilla trio',
    price: 219900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'gift-sets',
    badges: ['bestseller'],
    featured: false,
    createdAt: new Date('2025-02-20')
  },
  
  // ===== SIGNATURE CANDLES (Featured products) =====
  { 
    id: 15, 
    title: 'Enlight Signature Blend', 
    description: 'Our exclusive signature fragrance - sandalwood, jasmine & bergamot',
    price: 179900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'signature',
    badges: ['signature'],
    featured: true,
    createdAt: new Date('2025-05-01')
  },
  { 
    id: 16, 
    title: 'Midnight Jasmine Luxe', 
    description: 'Exotic jasmine bloom scent in hand-blown glass vessel',
    price: 134900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'signature',
    badges: ['signature'],
    featured: true,
    createdAt: new Date('2025-04-15')
  },
  { 
    id: 17, 
    title: 'Sandalwood Serenity', 
    description: 'Pure sandalwood essence in minimalist concrete vessel',
    price: 159900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'signature',
    badges: ['signature', 'bestseller'],
    featured: true,
    createdAt: new Date('2025-03-20')
  },
  { 
    id: 18, 
    title: 'Cherry Blossom Dream', 
    description: 'Delicate cherry blossom with hints of white tea - signature exclusive',
    price: 144900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'signature',
    badges: ['signature'],
    featured: true,
    createdAt: new Date('2025-02-10')
  },
  { 
    id: 19, 
    title: 'Midnight Oud', 
    description: 'Rich oud wood blend - our most luxurious signature',
    price: 219900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'signature',
    badges: ['signature', 'limited-edition'],
    featured: true,
    createdAt: new Date('2025-01-15')
  },
  { 
    id: 20, 
    title: 'Bergamot & Bamboo', 
    description: 'Fresh bergamot with earthy bamboo - signature zen blend',
    price: 154900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'signature',
    badges: ['signature'],
    featured: true,
    createdAt: new Date('2024-12-20')
  },
  
  // ===== PREMIUM SCENTED =====
  { 
    id: 21, 
    title: 'French Lavender Luxe', 
    description: 'Premium French lavender in crystal glass jar',
    price: 189900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    category: 'premium-scented',
    badges: [],
    featured: false,
    createdAt: new Date('2025-02-10')
  },
  { 
    id: 22, 
    title: 'Champagne Rose Elite', 
    description: 'Delicate rose champagne fragrance in gold-rimmed jar',
    price: 169900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'premium-scented',
    badges: [],
    featured: false,
    createdAt: new Date('2025-01-25')
  },
  { 
    id: 23, 
    title: 'Oud Wood Premium', 
    description: 'Rare oud wood scent - the epitome of luxury',
    price: 299900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'premium-scented',
    badges: ['limited-edition'],
    featured: false,
    createdAt: new Date('2025-01-01')
  },
  { 
    id: 24, 
    title: 'White Tea & Ginger', 
    description: 'Sophisticated white tea with a hint of spicy ginger',
    price: 179900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'premium-scented',
    badges: [],
    featured: false,
    createdAt: new Date('2024-12-15')
  },
  { 
    id: 25, 
    title: 'Black Orchid Essence', 
    description: 'Exotic black orchid in matte black ceramic vessel',
    price: 209900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'premium-scented',
    badges: [],
    featured: false,
    createdAt: new Date('2024-11-20')
  },
  { 
    id: 26, 
    title: 'Cashmere & Silk', 
    description: 'Luxurious cashmere musk with silk undertones',
    price: 194900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'premium-scented',
    badges: [],
    featured: false,
    createdAt: new Date('2024-10-25')
  },
  
  // ===== PILLAR CANDLES =====
  { 
    id: 27, 
    title: 'Sunset Orange Pillar', 
    description: 'Vibrant orange citrus scent in classic pillar form',
    price: 69900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-12-01')
  },
  { 
    id: 28, 
    title: 'Mint Fresh Pillar', 
    description: 'Cooling peppermint fragrance for clarity and focus',
    price: 74900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-11-15')
  },
  { 
    id: 29, 
    title: 'Eucalyptus Zen Pillar', 
    description: 'Calming eucalyptus in sustainable palm wax',
    price: 84900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-10-20')
  },
  { 
    id: 30, 
    title: 'Honey Almond Pillar', 
    description: 'Sweet honey with roasted almond notes',
    price: 77900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-09-10')
  },
  { 
    id: 31, 
    title: 'Coconut Lime Pillar', 
    description: 'Tropical coconut with zesty lime - summer favorite',
    price: 72900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-08-15')
  },
  { 
    id: 32, 
    title: 'Cedarwood Forest Pillar', 
    description: 'Earthy cedarwood with pine undertones',
    price: 81900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'pillar',
    badges: [],
    featured: false,
    createdAt: new Date('2024-07-20')
  },
  
  // ===== GIFT SETS =====
  { 
    id: 33, 
    title: 'Wellness Trio Gift Box', 
    description: 'Lavender, eucalyptus & chamomile candles in luxury box',
    price: 224900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'gift-sets',
    badges: [],
    featured: false,
    createdAt: new Date('2024-09-10')
  },
  { 
    id: 34, 
    title: 'Romance Collection', 
    description: 'Rose, jasmine & vanilla candles perfect for special moments',
    price: 199900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'gift-sets',
    badges: [],
    featured: false,
    createdAt: new Date('2024-08-05')
  },
  { 
    id: 35, 
    title: 'Festival Celebration Pack', 
    description: 'Set of 5 decorative candles for festive occasions',
    price: 179900, 
    imageUrl: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    category: 'gift-sets',
    badges: ['sale'],
    featured: false,
    createdAt: new Date('2024-07-01')
  },
  { 
    id: 36, 
    title: 'Zen Garden Set', 
    description: 'Bamboo, green tea & lotus - perfect meditation set',
    price: 189900, 
    imageUrl: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    category: 'gift-sets',
    badges: [],
    featured: false,
    createdAt: new Date('2024-06-15')
  },
  { 
    id: 37, 
    title: 'Luxury Spa Experience', 
    description: 'Premium spa scents with accessories - ultimate indulgence',
    price: 299900, 
    imageUrl: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    category: 'gift-sets',
    badges: ['limited-edition'],
    featured: false,
    createdAt: new Date('2024-05-20')
  },
  { 
    id: 38, 
    title: 'Seasonal Delights Quad', 
    description: '4 candles representing each season of the year',
    price: 239900, 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    category: 'gift-sets',
    badges: [],
    featured: false,
    createdAt: new Date('2024-04-10')
  }
];

// Get all artworks
app.get('/api/artworks', (req, res) => {
  res.json(artworks);
});

// Get new arrivals (last 30 days)
app.get('/api/artworks/new-arrivals', (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newArrivals = artworks
    .filter(art => new Date(art.createdAt) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(newArrivals);
});

// Get bestsellers
app.get('/api/artworks/bestsellers', (req, res) => {
  const bestsellers = artworks.filter(art => art.badges.includes('bestseller'));
  res.json(bestsellers);
});

// Get by category
app.get('/api/artworks/category/:categoryName', (req, res) => {
  const { categoryName } = req.params;
  const categoryProducts = artworks.filter(art => art.category === categoryName);
  res.json(categoryProducts);
});

// Get featured products (for Signature section)
app.get('/api/artworks/featured', (req, res) => {
  const featured = artworks.filter(art => art.featured === true);
  res.json(featured);
});

// Get products by badge
app.get('/api/artworks/badge/:badgeName', (req, res) => {
  const { badgeName } = req.params;
  const badgeProducts = artworks.filter(art => art.badges.includes(badgeName));
  res.json(badgeProducts);
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: 'INR',
      payment_capture: 1
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
