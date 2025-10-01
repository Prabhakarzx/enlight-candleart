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

// Sample artwork listing
const artworks = [
  { id: 1, title: 'Sunset Canvas', price: 50000 },
  { id: 2, title: 'Abstract Colors', price: 75000 },
  { id: 3, title: 'Modern Art', price: 120000 }
];

// Get all artworks
app.get('/api/artworks', (req, res) => {
  res.json(artworks);
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
