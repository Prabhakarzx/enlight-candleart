import React from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slides = [
  {
    image: 'https://floriy.co/cdn/shop/files/F113FB90-7ACF-4A46-A274-555310AE4A89.jpg?v=1752172173&width=1600',
    caption: 'Petals Of Love Bouquet',
  },
  {
    image: 'https://floriy.co/cdn/shop/files/12_c79f27b7-8cbd-49ec-8c52-fbca810159b6.png?v=1752447713&width=1600',
    caption: 'Old Monk Candle (Face Addition)',
  },
  {
    image: 'https://floriy.co/cdn/shop/files/75AE95A2-C704-4B08-B2D0-888E44FEFC4E.jpg?v=1752176868&width=1600',
    caption: 'White Daisy',
  },
  {
    image: 'https://floriy.co/cdn/shop/files/IMG-9016.png?v=1757966914&width=1600',
    caption: 'Lakshmi Ganesh Candle Gift Set',
  },
];

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: 24,
        zIndex: 2,
        bgcolor: 'rgba(255,255,255,0.7)',
        boxShadow: 2,
        transform: 'translateY(-50%)',
        '&:hover': { bgcolor: '#fbeee6' },
      }}
      aria-label="next slide"
    >
      <ArrowForwardIosIcon fontSize="medium" />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: { xs: 8, sm: 16, md: 24 },
        zIndex: 2,
        bgcolor: 'rgba(255,255,255,0.9)',
        boxShadow: 2,
        transform: 'translateY(-50%)',
        width: { xs: 36, md: 48 },
        height: { xs: 36, md: 48 },
        '&:hover': { bgcolor: '#fbeee6' },
      }}
      aria-label="previous slide"
    >
      <ArrowBackIosNewIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
    </IconButton>
  );
}

const InfiniteSlider = () => {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    dots: true,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ width: '100vw', height: { xs: '60vh', sm: '70vh', md: '100vh' }, position: 'relative', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw', overflow: 'hidden' }}>
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <Box key={idx} sx={{ position: 'relative', width: '100vw', height: { xs: '60vh', sm: '70vh', md: '100vh' } }}>
            <Box
              component="img"
              src={slide.image}
              alt={slide.caption}
              sx={{
                width: '100vw',
                height: { xs: '60vh', sm: '70vh', md: '100vh' },
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Typography
              variant="h4"
              sx={{
                position: 'absolute',
                bottom: { xs: '8vh', md: '15vh' },
                left: { xs: '4vw', md: '10vw' },
                right: { xs: '4vw', md: 'auto' },
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.35)',
                px: { xs: 2, sm: 3, md: 6 },
                py: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: { xs: 2, md: 3 },
                fontWeight: 700,
                letterSpacing: { xs: 0.5, md: 1.2 },
                fontSize: { xs: '1rem', sm: '1.5rem', md: '3rem' },
                boxShadow: 3,
                backdropFilter: 'blur(8px)',
                textTransform: 'uppercase',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {slide.caption}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default InfiniteSlider;
