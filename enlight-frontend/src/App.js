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
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';
import InfiniteSlider from './components/InfiniteSlider';

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

  // Flashing/changing promo text
  const promoMessages = [
    'Get 10% off on your first purchase with code TULIKANEW',
    'Welcome to Enlight store',
    'Handcrafted candles & art gifts',
    'Free shipping on orders over ₹999',
  ];
  const [flashingText, setFlashingText] = useState(promoMessages[0]);
  
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % promoMessages.length;
      setFlashingText(promoMessages[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
    // Open cart drawer immediately
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleIncreaseQty = (id) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const handleDecreaseQty = (id) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        if (item.qty > 1) return { ...item, qty: item.qty - 1 };
        return null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleBuy = async (art) => {
    setPayingId(art.id);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setPayingId(null);
      return;
    }

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
      key: 'YOUR_RAZORPAY_KEY_ID',
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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      return;
    }

    let order;
    try {
      const orderRes = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      });
      order = await orderRes.json();
    } catch (err) {
      alert('Failed to connect to backend.');
      return;
    }

    if (!order.id) {
      alert('Failed to create order. ' + (order.error || ''));
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: order.amount,
      currency: order.currency,
      name: 'Enlight Art Gallery',
      description: 'Purchase from Enlight Art Gallery',
      order_id: order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        setCart([]);
        setCartOpen(false);
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#1976d2'
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      {/* Cart Drawer */}
      <Drawer 
        anchor="right" 
        open={cartOpen} 
        onClose={() => setCartOpen(false)}
        transitionDuration={250}
        SlideProps={{
          timeout: { enter: 250, exit: 200 }
        }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: '#fff',
            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: 0
        }} role="presentation">
          {/* Cart Header */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            borderBottom: '1px solid #eee'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Typography sx={{ 
                fontSize: '1.5rem',
                color: '#111',
                fontWeight: 500
              }}>
                Your cart
              </Typography>
              <IconButton 
                onClick={() => setCartOpen(false)}
                sx={{ 
                  p: 1,
                  color: '#111',
                  '&:hover': { 
                    bgcolor: 'transparent',
                  }
                }}
                aria-label="close cart"
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              px: 1,
              color: '#666',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              <Typography>PRODUCT</Typography>
              <Typography>TOTAL</Typography>
            </Box>
          </Box>
          <List sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            py: 0,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          }}>
            {cart.length === 0 && (
              <ListItem>
                <ListItemText primary="Cart is empty" />
              </ListItem>
            )}
            {cart.map((item) => (
              <ListItem 
                key={item.id} 
                sx={{ 
                  py: 2,
                  px: 3,
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flex: 1,
                  gap: 2
                }}>
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.title}
                    sx={{
                      width: 70,
                      height: 70,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      fontWeight: 500, 
                      mb: 1,
                      fontSize: '0.95rem'
                    }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ 
                      color: '#666',
                      fontSize: '0.9rem',
                      mb: 1
                    }}>
                      Rs. {(item.price / 100).toLocaleString('en-IN')}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <IconButton 
                        onClick={() => handleDecreaseQty(item.id)} 
                        sx={{ 
                          p: 0.5,
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <Typography sx={{ 
                        minWidth: '30px',
                        textAlign: 'center',
                        fontSize: '0.95rem'
                      }}>
                        {item.qty}
                      </Typography>
                      <IconButton 
                        onClick={() => handleIncreaseQty(item.id)} 
                        sx={{ 
                          p: 0.5,
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography sx={{ 
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#111'
                  }}>
                    Rs. {((item.price * item.qty) / 100).toLocaleString('en-IN')}
                  </Typography>
                  <IconButton 
                    onClick={() => handleRemoveFromCart(item.id)}
                    sx={{ 
                      p: 0.5,
                      '&:hover': { bgcolor: 'transparent' }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18, color: '#666' }} />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          {/* Order Instructions */}
          <Box sx={{ px: 3, py: 2 }}>
            <Button
              sx={{
                width: '100%',
                py: 1.5,
                color: '#111',
                borderColor: '#ddd',
                '&:hover': {
                  borderColor: '#111',
                  bgcolor: 'transparent'
                }
              }}
              variant="outlined"
            >
              Order special instructions
            </Button>
          </Box>

          {/* Cart total and checkout */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1 
            }}>
              <Typography sx={{ 
                fontWeight: 500,
                fontSize: '0.95rem'
              }}>
                Estimated total
              </Typography>
              <Typography sx={{ 
                fontWeight: 500,
                fontSize: '0.95rem'
              }}>
                Rs. {(cart.reduce((sum, item) => sum + item.price * item.qty, 0) / 100).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Typography sx={{ 
              color: '#666',
              fontSize: '0.85rem',
              mb: 2
            }}>
              Taxes included. Discounts and shipping calculated at checkout.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={cart.length === 0}
              onClick={handleCheckout}
              sx={{
                bgcolor: '#111',
                color: '#fff',
                py: 1.5,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: '#000'
                }
              }}
            >
              Check out
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Promo Bar and Search Section */}
      <Box sx={{ width: '100%', bgcolor: '#111', color: '#fff', py: 2, px: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Flashing Promo */}
        <Typography 
          sx={{ 
            fontSize: 15, 
            fontWeight: 500, 
            minHeight: 24, 
            mb: 2,
            animation: 'fadeInOut 0.8s ease-in-out',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translateY(-5px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {flashingText}
        </Typography>
        {/* Main Navigation Row */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: { xs: 2, md: 3 }
        }}>
          {/* Left: Site Name */}
          <Typography sx={{ 
            fontWeight: 700, 
            fontSize: { xs: 18, md: 22 }, 
            letterSpacing: 1, 
            color: '#fff', 
            flex: '0 0 auto', 
            whiteSpace: 'nowrap',
            minWidth: { xs: '140px', md: '200px' }
          }}>
            Enlight Candle Art
          </Typography>
          {/* Center: Search */}
          <Box sx={{ 
            flex: '1 1 auto', 
            display: 'flex', 
            justifyContent: 'center', 
            maxWidth: '500px',
            px: { xs: 1, md: 2 }
          }}>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for products..."
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              <SearchIcon 
              sx={{ 
                position: 'absolute', 
                right: 12, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'rgba(255,255,255,0.5)',
                transition: 'color 0.3s ease',
              }} 
            />
            </Box>
          </Box>
          {/* Right: Profile & Cart */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, md: 2 }, 
            flex: '0 0 auto',
            minWidth: { xs: '80px', md: '100px' },
            justifyContent: 'flex-end'
          }}>
            <IconButton sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <PersonOutlineIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
            </IconButton>
            <IconButton 
              onClick={() => setCartOpen(true)} 
              sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <Badge 
                badgeContent={cart.length} 
                color="primary"
                sx={{ '& .MuiBadge-badge': { bgcolor: '#fff', color: '#111' } }}
              >
                <ShoppingCartIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
              </Badge>
            </IconButton>
          </Box>
        </Box>
        {/* Bottom row: Categories */}
        <Box sx={{ width: '100%', maxWidth: 900, display: 'flex', justifyContent: 'center', gap: 4, mt: 1 }}>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Candles</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Forever Flowers</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Gift Sets</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Decor Essentials</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Our Story</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Contact Us</Typography>
        </Box>
      </Box>

      {/* Hero Slider */}
      <InfiniteSlider />

      {/* Artworks/Grid Section */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 4 }}>
          Featured Candle Art
        </Typography>
        <Grid container spacing={4}>
          {loading && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          )}
          {error && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            </Grid>
          )}
          {!loading && !error && artworks.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No artworks found.
              </Typography>
            </Grid>
          )}
          {!loading && !error && artworks.map((art) => (
            <Grid item xs={12} sm={6} md={4} key={art.id}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={art.imageUrl}
                  alt={art.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {art.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {art.description}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    ₹{(art.price / 100).toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleAddToCart(art)}
                    sx={{ borderRadius: 20, px: 3, py: 1 }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleBuy(art)}
                    sx={{ borderRadius: 20, px: 3, py: 1 }}
                  >
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#f7f7f7', borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                © 2023 Enlight Art Gallery. All rights reserved.
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Designed with ❤️ by Your Name
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Button color="inherit" size="small" sx={{ fontWeight: 500 }}>
                  Privacy Policy
                </Button>
                <Button color="inherit" size="small" sx={{ fontWeight: 500 }}>
                  Terms of Service
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;