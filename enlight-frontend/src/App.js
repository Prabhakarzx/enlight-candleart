
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function App() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load artworks');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (art) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === art.id);
      if (exists) {
        return prev.map((item) => item.id === art.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...art, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuy = async (art) => {
    setPayingId(art.id);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setPayingId(null);
      return;
    }

    // Create order on backend
    let order;
    try {
      const orderRes = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: art.price })
      });
      order = await orderRes.json();
    } catch (err) {
      alert('Failed to connect to backend.');
      setPayingId(null);
      return;
    }
    if (!order.id) {
      alert('Failed to create order. ' + (order.error || ''));
      setPayingId(null);
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key id
      amount: order.amount,
      currency: order.currency,
      name: 'Enlight Art Gallery',
      description: art.title,
      order_id: order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#3399cc'
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setPayingId(null);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f7f7f7', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: '#222' }}>
            Enlight Candle Art
          </Typography>
          <IconButton color="primary" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={cart.reduce((sum, item) => sum + item.qty, 0)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }} role="presentation">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your Cart</Typography>
          <Divider />
          <List>
            {cart.length === 0 && <ListItem><ListItemText primary="Cart is empty" /></ListItem>}
            {cart.map((item) => (
              <ListItem key={item.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText
                  primary={item.title}
                  secondary={`Qty: ${item.qty} | ₹${((item.price * item.qty) / 100).toLocaleString('en-IN')}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ color: '#222', mb: 4 }}>
          Discover Unique Candle Art
        </Typography>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error" align="center">{error}</Typography>}
        <Grid container spacing={4}>
          {artworks.map((art) => (
            <Grid item xs={12} sm={6} md={4} key={art.id}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#fff', minHeight: 260 }}>
                {/* Placeholder for product image */}
                <Box sx={{ height: 160, bgcolor: '#f2e9e1', borderTopLeftRadius: 16, borderTopRightRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h2" color="#e0b973">🕯️</Typography>
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#222' }}>
                    {art.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#888', mb: 1 }}>
                    Price: <span style={{ color: '#222', fontWeight: 700 }}>₹{(art.price / 100).toLocaleString('en-IN')}</span>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 600, mr: 1 }}
                    onClick={() => handleAddToCart(art)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                    onClick={() => handleBuy(art)}
                    disabled={payingId === art.id}
                  >
                    {payingId === art.id ? <CircularProgress size={24} color="inherit" /> : 'Buy Now'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
