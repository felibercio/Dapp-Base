import React from 'react';
import { Box, Typography } from '@mui/material';
import capyLogo from '../images/capy1.png';

const CapyLogo = ({
  size = 48,
  showText = false,
  variant = 'default',
  animated = false
}) => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const textStyle = {
    fontFamily: '"Inter", sans-serif',
    fontWeight: 700,
    color: variant === 'white' ? 'white' : '#2C3E50',
    textShadow: variant === 'white' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    fontSize: size * 0.4,
    marginLeft: 2,
  };

  const logoStyle = {
    width: size,
    height: size,
    transition: 'all 0.3s ease',
    animation: animated ? 'capy-float 3s ease-in-out infinite' : 'none',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      filter: 'drop-shadow(0 6px 20px rgba(95, 190, 170, 0.3))',
    }
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={logoStyle}>
        <img src={capyLogo} alt="Capy Pay Logo" style={{ width: '100%', height: '100%' }} />
      </Box>
      {showText && (
        <Typography sx={textStyle}>
          Capy Pay
        </Typography>
      )}
    </Box>
  );
};

export default CapyLogo;
