import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'signature',
    title: 'Signature Candles',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    description: 'Our exclusive signature blends'
  },
  {
    id: 'premium-scented',
    title: 'Premium Scented',
    image: 'https://images.unsplash.com/photo-1615791184229-1e44d6ad4abb?w=400',
    description: 'Luxury fragrances for your space'
  },
  {
    id: 'pillar',
    title: 'Pillar Candles',
    image: 'https://images.unsplash.com/photo-1602874801006-e7f11772a2f1?w=400',
    description: 'Classic pillars in various scents'
  },
  {
    id: 'gift-sets',
    title: 'Gift Sets',
    image: 'https://images.unsplash.com/photo-1598518619776-eae3f8a34eac?w=400',
    description: 'Perfect gifts for loved ones'
  },
  {
    id: 'wedding',
    title: 'Wedding Collection',
    image: 'https://images.unsplash.com/photo-1602874801265-3c8a092a0cbc?w=400',
    description: 'Elegant candles for special days'
  },
  {
    id: 'decor',
    title: 'Decor Essentials',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
    description: 'Beautiful pieces for home decor'
  }
];

const CategoryGrid = ({ title, subtitle }) => {
  return (
    <Box sx={{ 
      py: { xs: 4, md: 6 }, 
      bgcolor: '#fafafa',
      width: '100%',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        px: { xs: 2, md: 4 },
        width: '100%'
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
            {title || 'Shop By Collections'}
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

        {/* Category Cards Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', margin: 0 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id} sx={{ display: 'flex' }}>
              <Card
                component={Link}
                to={`/category/${category.id}`}
                sx={{
                  position: 'relative',
                  height: { xs: 250, md: 300 },
                  width: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                  '&:hover .category-image': {
                    transform: 'scale(1.1)',
                  },
                  '&:hover .category-overlay': {
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3))',
                  },
                }}
              >
                {/* Category Image */}
                <Box
                  className="category-image"
                  component="img"
                  src={category.image}
                  alt={category.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                
                {/* Overlay */}
                <Box
                  className="category-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2))',
                    color: 'white',
                    p: 3,
                    transition: 'background 0.3s ease',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    sx={{ mb: 0.5 }}
                  >
                    {category.title}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ opacity: 0.95 }}
                  >
                    {category.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CategoryGrid;
