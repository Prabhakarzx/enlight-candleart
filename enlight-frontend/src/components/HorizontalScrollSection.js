import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductBadge from './ProductBadge';

const HorizontalScrollSection = ({ 
  title, 
  subtitle, 
  products = [], 
  onAddToCart, 
  onBuyNow,
  viewAllLink 
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <Box sx={{ 
      py: { xs: 4, md: 6 }, 
      bgcolor: '#fafafa',
      position: 'relative'
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        px: { xs: 2, md: 4 } 
      }}>
        {/* Section Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.95rem' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {/* Desktop Navigation Arrows */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 1 
          }}>
            <IconButton 
              onClick={() => scroll('left')}
              sx={{ 
                bgcolor: 'white',
                boxShadow: 1,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              onClick={() => scroll('right')}
              sx={{ 
                bgcolor: 'white',
                boxShadow: 1,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Horizontal Scroll Container */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 2,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: '#e0e0e0',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#bdbdbd',
              borderRadius: 4,
              '&:hover': {
                bgcolor: '#9e9e9e',
              },
            },
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                minWidth: { xs: 280, sm: 320 },
                maxWidth: { xs: 280, sm: 320 },
                flexShrink: 0,
                borderRadius: 3,
                boxShadow: 2,
                position: 'relative',
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
                  height: 240,
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              
              {/* Product Details */}
              <CardContent sx={{ pb: 1 }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  gutterBottom
                  sx={{ 
                    fontSize: '1.1rem',
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
                  sx={{ fontSize: '1.2rem' }}
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
                    px: 2.5, 
                    py: 0.75,
                    textTransform: 'none',
                    fontSize: '0.875rem'
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
                    px: 2.5, 
                    py: 0.75,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  Buy Now
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* View All Link */}
        {viewAllLink && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="text"
              sx={{ 
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              View All {title} →
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HorizontalScrollSection;
