import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5FBEAA', // Verde-turquesa suave
      light: '#7BCFBD',
      dark: '#4A9688',
    },
    secondary: {
      main: '#B8860B', // Marrom quente/dourado
      light: '#D4A574',
      dark: '#8B6914',
    },
    background: {
      default: '#F0F9F7', // Fundo verde-turquesa muito suave
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E3A8A', // Azul-marinho escuro
      secondary: '#64748B',
    },
    info: {
      main: '#1E3A8A', // Azul-marinho escuro
    },
    success: {
      main: '#5FBEAA',
    },
    warning: {
      main: '#B8860B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1E3A8A',
    },
    h2: {
      fontWeight: 600,
      color: '#1E3A8A',
    },
    h3: {
      fontWeight: 600,
      color: '#1E3A8A',
    },
    h4: {
      fontWeight: 600,
      color: '#1E3A8A',
    },
    h5: {
      fontWeight: 500,
      color: '#1E3A8A',
    },
    h6: {
      fontWeight: 500,
      color: '#1E3A8A',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(184, 134, 11, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(184, 134, 11, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(95, 190, 170, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
