import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '1rem' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Featured Layout: Large Image Left + Products Grid Right */}
        <Grid container spacing={4}>
          {/* Left: Large Featured Image */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 400, md: '100%' },
                minHeight: { md: 600 },
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <Box
                component="img"
                src={featuredImage || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'}
                alt={featuredTitle || title}
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
                  p: 4,
                }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  {featuredTitle || 'Our Signature Collection'}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ opacity: 0.95 }}
                >
                  {featuredDescription || 'Handcrafted with love, designed to inspire'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right: Products Grid */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {products.slice(0, 6).map((product) => (
                <Grid item xs={12} sm={6} key={product.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
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
                    
                    {/* Product Details */}
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        gutterBottom
                        sx={{ 
                          fontSize: '1rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 40
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        color="primary"
                      >
                        ₹{(product.price / 100).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                    
                    {/* Product Actions */}
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => onAddToCart(product)}
                        sx={{ 
                          borderRadius: 20, 
                          px: 2, 
                          py: 0.5,
                          textTransform: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => onBuyNow(product)}
                        sx={{ 
                          borderRadius: 20, 
                          px: 2, 
                          py: 0.5,
                          textTransform: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        Buy Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Horizontal Slider - All Products */}
        {products.length > 6 && (
          <Box sx={{ mt: 6, position: 'relative' }}>
            {/* Slider Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5" fontWeight={600}>
                Explore All Signature Candles
              </Typography>
              
              {/* Navigation Arrows */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <IconButton
                  onClick={() => scroll('left')}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => scroll('right')}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Scrollable Container */}
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                pb: 2,
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
                    minWidth: 300,
                    maxWidth: 300,
                    borderRadius: 3,
                    boxShadow: 2,
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
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
                  
                  {/* Product Details */}
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ 
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 40
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      color="primary"
                    >
                      ₹{(product.price / 100).toLocaleString('en-IN')}
                    </Typography>
                  </CardContent>
                  
                  {/* Product Actions */}
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => onAddToCart(product)}
                      sx={{ 
                        borderRadius: 20, 
                        px: 2, 
                        py: 0.5,
                        textTransform: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onBuyNow(product)}
                      sx={{ 
                        borderRadius: 20, 
                        px: 2, 
                        py: 0.5,
                        textTransform: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      Buy Now
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeaturedSection;
