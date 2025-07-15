import React from 'react';
import { Box, Typography } from '@mui/material';

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
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fundo arredondado verde-turquesa */}
          <rect
            width="100"
            height="100"
            rx="22"
            ry="22"
            fill="#5FBEAA"
          />
          
          {/* Corpo principal da capivara - formato mais arredondado */}
          <ellipse
            cx="50"
            cy="55"
            rx="35"
            ry="32"
            fill="#CD853F"
            stroke="#2C3E50"
            strokeWidth="4"
          />
          
          {/* Orelha esquerda */}
          <ellipse
            cx="35"
            cy="28"
            rx="8"
            ry="12"
            fill="#CD853F"
            stroke="#2C3E50"
            strokeWidth="4"
          />
          <ellipse
            cx="35"
            cy="28"
            rx="4"
            ry="8"
            fill="#B8860B"
          />
          
          {/* Orelha direita */}
          <ellipse
            cx="65"
            cy="28"
            rx="8"
            ry="12"
            fill="#CD853F"
            stroke="#2C3E50"
            strokeWidth="4"
          />
          <ellipse
            cx="65"
            cy="28"
            rx="4"
            ry="8"
            fill="#B8860B"
          />
          
          {/* Narinas */}
          <ellipse cx="47" cy="52" rx="2" ry="1.5" fill="#2C3E50" />
          <ellipse cx="53" cy="52" rx="2" ry="1.5" fill="#2C3E50" />
          
          {/* Olho fechado sorridente */}
          <path
            d="M 42 45 Q 47 40 52 45"
            stroke="#2C3E50"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Boca sorridente */}
          <path
            d="M 45 62 Q 50 67 55 62"
            stroke="#2C3E50"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
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
