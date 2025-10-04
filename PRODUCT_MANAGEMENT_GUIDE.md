# 📦 Quick Reference Guide - Adding Products & Managing Categories

## Adding New Products

### Backend (`enlight-backend/index.js`)

Add to the `artworks` array:

```javascript
{
  id: 19,                              // Unique ID (increment from last)
  title: 'Lavender Dreams Pillar',    // Product name
  description: 'Hand-poured lavender scented pillar candle with natural soy wax',
  price: 89900,                        // Price in paise (₹899.00)
  imageUrl: 'https://...',             // Product image URL
  category: 'pillar',                  // See categories below
  badges: ['new', 'bestseller'],       // See badges below
  featured: false,                     // true = shows in Signature section
  createdAt: new Date('2025-10-05')   // Creation date
}
```

### Available Categories

```javascript
'signature'        // Signature Candles
'premium-scented'  // Premium Scented
'pillar'           // Pillar Candles
'gift-sets'        // Gift Sets
'wedding'          // Wedding Collection
'decor'            // Decor Essentials
```

### Available Badges

```javascript
'new'              // 🟢 New (Green) - Auto-shown if < 30 days old
'bestseller'       // 🟠 Bestseller (Orange) - Top sellers
'sale'             // 🔴 Sale (Red) - Discounted items
'limited-edition'  // 🟣 Limited Edition (Purple) - Exclusive
'signature'        // 🔵 Signature (Blue) - Signature collection
```

---

## Where Products Appear

### New Arrivals Section
**Criteria**: Products created within last 30 days
**Auto-populated**: Yes (based on `createdAt`)
**Badge**: Automatically gets 'new' badge if < 30 days

### Bestsellers Section
**Criteria**: Products with `'bestseller'` badge
**Manual**: Add `'bestseller'` to badges array

### Signature Candles Section
**Criteria**: Products with `featured: true`
**Manual**: Set `featured: true`
**Layout**: Large hero image + grid

### Premium Scented Section
**Criteria**: Products with `category: 'premium-scented'`
**Manual**: Set category

### Pillar Candles Section
**Criteria**: Products with `category: 'pillar'`
**Manual**: Set category

---

## Example Product Configurations

### 1. New Premium Candle
```javascript
{
  id: 19,
  title: 'Rose Gold Elegance',
  description: 'Luxurious rose gold candle with vanilla bourbon scent',
  price: 199900,  // ₹1,999
  imageUrl: 'https://example.com/rose-gold.jpg',
  category: 'premium-scented',
  badges: ['new'],  // Will auto-show in New Arrivals
  featured: false,
  createdAt: new Date('2025-10-05')
}
```
**Appears in:**
- ✅ New Arrivals (auto)
- ✅ Premium Scented section

---

### 2. Bestselling Signature Candle
```javascript
{
  id: 20,
  title: 'Midnight Jasmine Deluxe',
  description: 'Our most popular signature blend',
  price: 179900,  // ₹1,799
  imageUrl: 'https://example.com/midnight-jasmine.jpg',
  category: 'signature',
  badges: ['bestseller', 'signature'],
  featured: true,  // Shows in featured grid
  createdAt: new Date('2025-06-15')
}
```
**Appears in:**
- ✅ Bestsellers section
- ✅ Signature Candles section (featured layout)

---

### 3. Limited Edition Sale Item
```javascript
{
  id: 21,
  title: 'Festival Special Gift Set',
  description: 'Limited edition festive collection - 50% off!',
  price: 149900,  // ₹1,499 (was ₹2,999)
  imageUrl: 'https://example.com/festival-set.jpg',
  category: 'gift-sets',
  badges: ['sale', 'limited-edition', 'new'],
  featured: false,
  createdAt: new Date('2025-10-01')
}
```
**Appears in:**
- ✅ New Arrivals (< 30 days)
- ✅ Gift Sets category
**Shows badges:** 🔴 SALE, 🟣 LIMITED

---

## Changing Product Images

### Replace with Your Own
1. Upload images to your hosting (Cloudinary, AWS S3, etc.)
2. Update `imageUrl` field
3. Recommended size: 800x800px minimum
4. Format: JPG or PNG

### Using Placeholder Images
Current placeholders use Unsplash:
```javascript
imageUrl: 'https://images.unsplash.com/photo-{id}?w=400'
```

---

## API Endpoints Reference

### Get All Products
```
GET /api/artworks
```

### Get New Arrivals
```
GET /api/artworks/new-arrivals
```
Returns products created in last 30 days

### Get Bestsellers
```
GET /api/artworks/bestsellers
```
Returns products with 'bestseller' badge

### Get by Category
```
GET /api/artworks/category/:categoryName
```
Example: `/api/artworks/category/premium-scented`

### Get Featured Products
```
GET /api/artworks/featured
```
Returns products with `featured: true`

### Get by Badge
```
GET /api/artworks/badge/:badgeName
```
Example: `/api/artworks/badge/sale`

---

## Price Format

Prices are stored in **paise** (smallest currency unit):

```javascript
price: 50000   // ₹500.00
price: 89900   // ₹899.00
price: 124900  // ₹1,249.00
price: 299900  // ₹2,999.00
```

**Display conversion:**
```javascript
₹{(price / 100).toLocaleString('en-IN')}
```

---

## Section Visibility Rules

### Auto-Hide Empty Sections
Sections automatically hide if no products:
```javascript
{!loading && newArrivals.length > 0 && (
  <HorizontalScrollSection ... />
)}
```

### Manual Section Toggle
To hide a section, comment it out in `App.js`:
```javascript
// {/* Temporarily hide Premium Scented
{!loading && premiumScented.length > 0 && (
  <HorizontalScrollSection
    title="Premium Scented"
    ...
  />
)}
*/}
```

---

## Product Card Customization

### Horizontal Scroll Card Size
In `HorizontalScrollSection.js`:
```javascript
minWidth: { xs: 280, sm: 320 },  // Change width
height: 240,                      // Change image height
```

### Featured Section Grid
In `FeaturedSection.js`:
```javascript
products.slice(0, 6)  // Change max products (default: 6)
```

### Category Grid Columns
In `CategoryGrid.js`:
```javascript
<Grid item xs={12} sm={6} md={4}>
// xs={12} = 1 column on mobile
// sm={6}  = 2 columns on tablet
// md={4}  = 3 columns on desktop
```

---

## Troubleshooting

### Product Not Showing in New Arrivals?
✅ Check `createdAt` is within last 30 days
✅ Verify backend is running
✅ Check browser console for errors

### Product Not in Bestsellers?
✅ Add `'bestseller'` to badges array
✅ Restart backend server

### Product Not in Featured Section?
✅ Set `featured: true`
✅ Check category is 'signature' (recommended)
✅ Restart backend

### Badge Not Showing?
✅ Verify badge name is correct (see Available Badges)
✅ Check `ProductBadge.js` config
✅ Badges limited to 2 per card

---

## Database Integration (Future)

When ready to connect to MongoDB/PostgreSQL:

1. Create product schema matching current structure
2. Replace `artworks` array with database queries
3. Update API endpoints to fetch from DB
4. Add Create/Update/Delete endpoints

**Example MongoDB Schema:**
```javascript
const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  badges: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

---

## Quick Checklist for New Products

- [ ] Unique ID
- [ ] Descriptive title
- [ ] Price in paise format
- [ ] Valid image URL
- [ ] Correct category
- [ ] Appropriate badges
- [ ] Set `featured` if signature item
- [ ] Current `createdAt` date
- [ ] Test in development
- [ ] Verify in all sections
- [ ] Check mobile responsiveness

---

**Last Updated:** October 5, 2025  
**Maintained by:** Enlight Candle Art Development Team
