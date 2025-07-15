import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Payment,
  TrendingUp,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CapyLogo from './CapyLogo';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Pagamentos', path: '/payments', icon: <Payment /> },
    { label: 'Staking', path: '/staking', icon: <TrendingUp /> },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 2,
        background: 'linear-gradient(135deg, #5FBEAA 0%, #4A9688 100%)',
        boxShadow: '0 4px 20px rgba(95, 190, 170, 0.3)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <CapyLogo 
            size={40} 
            showText={true} 
            variant="white"
            animated={true}
          />
        </Box>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    color: '#1E3A8A',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(95, 190, 170, 0.1)',
                      color: '#5FBEAA',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    {item.label}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNavigate(item.path)}
                variant={location.pathname === item.path ? 'outlined' : 'text'}
                sx={{
                  color: 'white',
                  borderColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: 2,
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <ConnectButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
