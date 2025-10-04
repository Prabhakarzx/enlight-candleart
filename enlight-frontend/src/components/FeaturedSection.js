import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ProductBadge from './ProductBadge';

const FeaturedSection = ({ 
  title, 
  subtitle,
  featuredImage,
  featuredTitle,
  featuredDescription,
  products = [], 
  onAddToCart, 
  onBuyNow 
}) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <Box sx={{ 
      py: { xs: 4, md: 6 }, 
      bgcolor: '#fff'
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        px: { xs: 2, md: 4 } 
      }}>
        {/* Section Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            fontWeight={700}
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Box 
            component="a"
            href="#"
            sx={{ 
              fontSize: '0.9rem',
              color: 'primary.main',
              textDecoration: 'underline',
              '&:hover': { color: 'primary.dark' }
            }}
          >
            View all
          </Box>
        </Box>

        {/* Featured Layout: Large Image Left + Horizontal Slider Right */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'stretch'
        }}>
          {/* Left: Large Featured Image */}
          <Box
            sx={{
              width: { xs: '100%', md: '40%', lg: '37.5%' },
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 400, md: 500, lg: 550 },
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <Box
                component="img"
                src={featuredImage || products[0]?.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'}
                alt={featuredTitle || title}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Overlay Text */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: 'white',
                  p: 3,
                }}
              >
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ mb: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                >
                  {featuredTitle || 'Most Loved'}
                </Typography>
                <Typography 
                  variant="h3" 
                  fontWeight={700}
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    color: '#FFD700'
                  }}
                >
                  CANDLES
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: Horizontal Slider */}
          <Box
            sx={{
              width: { xs: '100%', md: '60%', lg: '62.5%' },
              flexGrow: 1
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              width: '100%',
              minHeight: { xs: 'auto', md: 500, lg: 550 },
              display: 'flex',
              alignItems: 'center',
              py: { xs: 0, md: 0 }
            }}>
              {/* Navigation Arrows */}
              <IconButton
                onClick={() => scroll('left')}
                sx={{
                  position: 'absolute',
                  left: { md: -15, lg: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: 3,
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': { bgcolor: 'white', boxShadow: 4 },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => scroll('right')}
                sx={{
                  position: 'absolute',
                  right: { md: -15, lg: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: 3,
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': { bgcolor: 'white', boxShadow: 4 },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>

              {/* Scrollable Container */}
              <Box
                ref={scrollContainerRef}
                sx={{
                  display: 'flex',
                  gap: 3,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollBehavior: 'smooth',
                  width: '100%',
                  pb: 2,
                  px: { md: 0.5 },
                  '&::-webkit-scrollbar': {
                    height: 8,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: 10,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: 10,
                    '&:hover': {
                      backgroundColor: '#555',
                    },
                  },
                }}
              >
                {products.map((product) => (
                  <Card
                    key={product.id}
                    sx={{
                      minWidth: { xs: 260, sm: 280, md: 300 },
                      maxWidth: { xs: 260, sm: 280, md: 300 },
                      borderRadius: 3,
                      boxShadow: 2,
                      position: 'relative',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      bgcolor: 'white',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {/* Product Badge */}
                    <ProductBadge badges={product.badges} />
                    
                    {/* Product Image */}
                    <Box
                      component="img"
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: 250,
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Product Details */}
                    <CardContent sx={{ flexGrow: 1, pb: 1, textAlign: 'center' }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        gutterBottom
                        sx={{ 
                          fontSize: '1rem',
                          mb: 1
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        sx={{ mb: 1 }}
                      >
                        ₹{(product.price / 100).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                    
                    {/* Product Actions */}
                    <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onAddToCart(product)}
                        sx={{ 
                          borderRadius: 1,
                          py: 1,
                          textTransform: 'none',
                          bgcolor: 'black',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#333',
                          }
                        }}
                      >
                        Add to cart
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(FeaturedSection);
