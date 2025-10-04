import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

const badgeConfig = {
  new: { label: 'New', color: '#4CAF50', bgColor: '#E8F5E9' },
  bestseller: { label: 'Bestseller', color: '#FF9800', bgColor: '#FFF3E0' },
  sale: { label: 'Sale', color: '#F44336', bgColor: '#FFEBEE' },
  'limited-edition': { label: 'Limited', color: '#9C27B0', bgColor: '#F3E5F5' },
  signature: { label: 'Signature', color: '#2196F3', bgColor: '#E3F2FD' }
};

const ProductBadge = ({ badges = [] }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <Box sx={{ 
      position: 'absolute', 
      top: 12, 
      left: 12, 
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5
    }}>
      {badges.slice(0, 2).map((badge, index) => {
        const config = badgeConfig[badge] || { label: badge, color: '#666', bgColor: '#f5f5f5' };
        return (
          <Chip
            key={index}
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.bgColor,
              color: config.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        );
      })}
    </Box>
  );
};

export default React.memo(ProductBadge);
