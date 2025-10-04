import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import Box from '@mui/material/Box';
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
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';

const InfiniteSlider = React.lazy(() => import('./components/InfiniteSlider'));
const HorizontalScrollSection = React.lazy(() => import('./components/HorizontalScrollSection'));
const FeaturedSection = React.lazy(() => import('./components/FeaturedSection'));
const CategoryGrid = React.lazy(() => import('./components/CategoryGrid'));

const PROMO_MESSAGES = [
  'Get 10% off on your first purchase with code TULIKANEW',
  'Welcome to Enlight store',
  'Handcrafted candles & art gifts',
  'Free shipping on orders over ₹999',
];

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
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');
  const [artworks, setArtworks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [signatureProducts, setSignatureProducts] = useState([]);
  const [premiumScented, setPremiumScented] = useState([]);
  const [pillarCandles, setPillarCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
// Search & filtering state
const [searchQuery, setSearchQuery] = useState('');
const [showSuggestions, setShowSuggestions] = useState(false);

// Flashing/changing promo text
const [flashingText, setFlashingText] = useState(PROMO_MESSAGES[0]);

const suggestions = useMemo(() => {
  if (!searchQuery || isSearchPage) {
    return [];
  }
  const lower = searchQuery.toLowerCase();
  return artworks
    .filter((a) => a.title && a.title.toLowerCase().includes(lower))
    .slice(0, 6);
}, [searchQuery, artworks, isSearchPage]);

const filteredArtworks = useMemo(() => {
  if (isSearchPage) {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q') || '';
    if (!qParam.trim()) {
      return [];
    } else {
      const lowered = qParam.trim().toLowerCase();
      return artworks.filter(
        (a) =>
          (a.title && a.title.toLowerCase().includes(lowered)) ||
          (a.description && a.description.toLowerCase().includes(lowered))
      );
    }
  } else {
    return artworks;
  }
}, [isSearchPage, location.search, artworks]);  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
    idx = (idx + 1) % PROMO_MESSAGES.length;
    setFlashingText(PROMO_MESSAGES[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Single fetch for all artworks, then filter client-side for better performance
    fetch('http://localhost:5000/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data);
        
        // Filter data client-side to reduce API calls
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setNewArrivals(data.filter(art => new Date(art.createdAt) >= thirtyDaysAgo).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setBestsellers(data.filter(art => art.badges?.includes('bestseller')));
        setSignatureProducts(data.filter(art => art.featured === true));
        setPremiumScented(data.filter(art => art.category === 'premium-scented'));
        setPillarCandles(data.filter(art => art.category === 'pillar'));
        
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load artworks');
        setLoading(false);
      });
  }, []);



  // Sync search query with route params
  useEffect(() => {
    if (isSearchPage) {
      const params = new URLSearchParams(location.search);
      const qParam = params.get('q') || '';
      setSearchQuery((prev) => (prev === qParam ? prev : qParam));
      setShowSuggestions(false);
    }
  }, [isSearchPage, location.search]);

  useEffect(() => {
    if (isSearchPage) {
      setShowSuggestions(false);
    }
  }, [isSearchPage]);

  const performSearch = useCallback((queryValue) => {
    const query = queryValue !== undefined ? queryValue : searchQuery;
    const trimmed = query.trim();

    if (!trimmed) {
      if (queryValue !== undefined) {
        setSearchQuery(queryValue);
      }
      if (isSearchPage) {
        navigate('/');
      }
      setShowSuggestions(false);
      return;
    }

    setSearchQuery(query);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [searchQuery, isSearchPage, navigate]);

  const handleSuggestionClick = useCallback((title) => {
    performSearch(title);
  }, [performSearch]);

  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!isSearchPage) {
      setShowSuggestions(true);
    }
  }, [isSearchPage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      performSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [performSearch]);

  const handleAddToCart = useCallback((art) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === art.id);
      if (exists) {
        return prev.map((item) => item.id === art.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...art, qty: 1 }];
    });
    // Open cart drawer immediately
    setCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleIncreaseQty = useCallback((id) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  }, []);

  const handleDecreaseQty = useCallback((id) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        if (item.qty > 1) return { ...item, qty: item.qty - 1 };
        return null;
      }
      return item;
    }).filter(Boolean));
  }, []);

  const handleBuy = async (art) => {
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
        body: JSON.stringify({ amount: art.price })
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

  const renderProductGrid = (items, heading, emptyMessage, subtitle) => (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: subtitle ? 2 : 4 }}>
        {heading}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          {subtitle}
        </Typography>
      )}
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
        {!loading && !error && items.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              {emptyMessage}
            </Typography>
          </Grid>
        )}
        {!loading && !error && items.map((art) => (
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
  );

  const trimmedSearch = searchQuery.trim();

  return (
    <>
      {/* Mobile Menu Drawer */}
      <Drawer 
        anchor="left" 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)}
        transitionDuration={250}
        PaperProps={{
          sx: {
            width: { xs: '75%', sm: 300 },
            bgcolor: '#111',
            color: '#fff',
          }
        }}
      >
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: 0
        }}>
          {/* Menu Header */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography sx={{ 
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#fff'
            }}>
              Menu
            </Typography>
            <IconButton 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                p: 1,
                color: '#fff',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          
          {/* Menu Items */}
          <List sx={{ pt: 2 }}>
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Candles" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Forever Flowers" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Gift Sets" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Decor Essentials" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Our Story" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setMenuOpen(false)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary="Contact Us" 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

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
  <Box sx={{ width: '100%', bgcolor: '#111', color: '#fff', py: { xs: 1.5, md: 2 }, px: { xs: 1, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden', boxSizing: 'border-box' }}>
        {/* Flashing Promo */}
        <Typography 
          sx={{ 
            fontSize: { xs: 13, md: 15 },
            fontWeight: 500, 
            minHeight: { xs: 20, md: 24 },
            mb: { xs: 1.5, md: 2 },
            textAlign: 'center',
            px: { xs: 1, md: 0 },
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
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: { md: 'space-between' },
          gap: { xs: 1.5, md: 3 }
        }}>
          {/* Mobile: Top Row - Menu Icon, Site Name, User Icons */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1,
            overflow: 'hidden'
          }}>
            {/* Left: Menu Icon + Site Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
              <IconButton 
                onClick={() => setMenuOpen(true)}
                sx={{ 
                  color: '#fff',
                  p: 0.25,
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <MenuIcon sx={{ fontSize: 22 }} />
              </IconButton>
              
              <Typography
                component={Link}
                to="/"
                onClick={() => setMenuOpen(false)}
                sx={{ 
                  fontWeight: 700, 
                  fontSize: 15,
                  letterSpacing: 0.3, 
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textDecoration: 'none'
                }}
              >
                Enlight Candle Art
              </Typography>
            </Box>
            
            {/* Right: User Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
              <IconButton sx={{ color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <PersonOutlineIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton 
                onClick={() => setCartOpen(true)} 
                sx={{ color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Badge 
                  badgeContent={cart.length} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { bgcolor: '#fff', color: '#111', fontSize: 9, minWidth: 16, height: 16 } }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Box>
          </Box>

          {/* Mobile: Second Row - Search */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            width: '100%'
          }}>
            <Box 
              sx={{ 
                width: '100%', 
                position: 'relative',
                '& input:focus + svg': {
                  color: '#fff',
                }
              }}
            >
              <input
                type="text"
                placeholder="Search for products..."
                style={{
                  width: '100%',
                  padding: '8px 36px 8px 12px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.8)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.15)';
                  if (!isSearchPage) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.3)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.boxShadow = 'none';
                  // Delay hiding to allow click
                  setTimeout(() => setShowSuggestions(false), 180);
                }}
              />
              <SearchIcon 
                onClick={performSearch}
                sx={{ 
                  position: 'absolute', 
                  right: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'color 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': { color: '#fff' }
                }} 
              />
              {showSuggestions && !isSearchPage && suggestions.length > 0 && (
                <Box sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  bgcolor: '#1c1c1c',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  mt: 0.5,
                  zIndex: 30,
                  maxHeight: 260,
                  overflowY: 'auto',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}>
                  {suggestions.map(s => (
                    <Box
                      key={s.id}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        handleSuggestionClick(s.title);
                      }}
                      sx={{
                        px: 1.5,
                        py: 1,
                        fontSize: 13,
                        color: '#eee',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {s.title}
                      </span>
                      <span style={{ opacity: 0.5, fontSize: 11 }}>
                        ₹{(s.price/100).toLocaleString('en-IN')}
                      </span>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Desktop Layout */}
          {/* Left: Site Name */}
          <Typography
            component={Link}
            to="/"
            sx={{ 
              display: { xs: 'none', md: 'block' },
              fontWeight: 700, 
              fontSize: 22,
              letterSpacing: 1, 
              color: '#fff', 
              flex: '0 0 auto',
              whiteSpace: 'nowrap',
              minWidth: '200px',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            Enlight Candle Art
          </Typography>
          
          {/* Center: Search (Desktop) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            flex: '1 1 auto',
            justifyContent: 'center', 
            maxWidth: '500px',
            px: 2
          }}>
            <Box 
              sx={{ 
                width: '100%', 
                position: 'relative',
                '& input:focus + svg': {
                  color: '#fff',
                }
              }}
            >
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
                  boxSizing: 'border-box'
                }}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.8)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.15)';
                  if (!isSearchPage) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.3)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.boxShadow = 'none';
                  setTimeout(() => setShowSuggestions(false), 180);
                }}
              />
              <SearchIcon 
                onClick={performSearch}
                sx={{ 
                  position: 'absolute', 
                  right: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'color 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': { color: '#fff' }
                }} 
              />
              {showSuggestions && !isSearchPage && suggestions.length > 0 && (
                <Box sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  bgcolor: '#1c1c1c',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  mt: 0.5,
                  zIndex: 30,
                  maxHeight: 260,
                  overflowY: 'auto',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}>
                  {suggestions.map(s => (
                    <Box
                      key={s.id}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        handleSuggestionClick(s.title);
                      }}
                      sx={{
                        px: 1.5,
                        py: 1,
                        fontSize: 13,
                        color: '#eee',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {s.title}
                      </span>
                      <span style={{ opacity: 0.5, fontSize: 11 }}>
                        ₹{(s.price/100).toLocaleString('en-IN')}
                      </span>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Right: Profile & Cart (Desktop) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center', 
            gap: 2, 
            flex: '0 0 auto',
            minWidth: '100px',
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
        {/* Bottom row: Categories - Desktop Only */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900, 
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center', 
          gap: 4, 
          mt: 1 
        }}>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Candles</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Forever Flowers</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Gift Sets</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Decor Essentials</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Our Story</Typography>
          <Typography sx={{ color: '#fff', fontSize: 16, mx: 2, cursor: 'pointer', fontWeight: 500 }}>Contact Us</Typography>
        </Box>
      </Box>

      {!isSearchPage && (
        <Suspense fallback={<Box sx={{ height: { xs: '60vh', sm: '70vh', md: '100vh' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
          <InfiniteSlider />
        </Suspense>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* New Arrivals Section */}
              {!loading && newArrivals.length > 0 && (
                <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                  <HorizontalScrollSection
                    title="New Arrivals"
                    subtitle="Discover our latest handcrafted candle creations"
                    products={newArrivals}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuy}
                    viewAllLink
                  />
                </Suspense>
              )}

              {/* Bestsellers Section */}
              {!loading && bestsellers.length > 0 && (
                <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                  <HorizontalScrollSection
                    title="Bestsellers"
                    subtitle="Customer favorites that everyone loves"
                    products={bestsellers}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuy}
                    viewAllLink
                  />
                </Suspense>
              )}

              {/* Signature Candles - Featured Section */}
              {!loading && signatureProducts.length > 0 && (
                <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                  <FeaturedSection
                    title="Signature Candles"
                    subtitle="Our exclusive signature blends, crafted with passion"
                    featuredImage="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"
                    featuredTitle="Enlight Signature Collection"
                    featuredDescription="Handcrafted with love, designed to inspire serenity and warmth in your space"
                    products={signatureProducts}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuy}
                  />
                </Suspense>
              )}

              {/* Premium Scented Section */}
              {!loading && premiumScented.length > 0 && (
                <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                  <HorizontalScrollSection
                    title="Premium Scented"
                    subtitle="Luxury fragrances for the most discerning customers"
                    products={premiumScented}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuy}
                    viewAllLink
                  />
                </Suspense>
              )}

              {/* Pillar Candles Section */}
              {!loading && pillarCandles.length > 0 && (
                <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                  <HorizontalScrollSection
                    title="Pillar Candles"
                    subtitle="Classic pillar candles in various scents and sizes"
                    products={pillarCandles}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuy}
                    viewAllLink
                  />
                </Suspense>
              )}

              {/* Shop By Collections */}
              <Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Box>}>
                <CategoryGrid
                  title="Shop By Collections"
                  subtitle="Browse our curated collections for every occasion"
                />
              </Suspense>
            </>
          }
        />
        <Route
          path="/search"
          element={renderProductGrid(
            filteredArtworks,
            trimmedSearch ? `Results for "${trimmedSearch}"` : 'Search Results',
            trimmedSearch ? 'No products match your search.' : 'Enter a product name above to start searching.',
            !loading && !error && trimmedSearch
              ? `${filteredArtworks.length} result${filteredArtworks.length === 1 ? '' : 's'} for "${trimmedSearch}"`
              : undefined
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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