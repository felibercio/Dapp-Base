import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import { 
  Send, 
  GetApp, 
  Receipt,
  Settings,
  Help,
  Visibility,
  VisibilityOff,
  QrCodeScanner,
  History,
  TrendingUp,
  AccountBalance,
  Security,
  Notifications
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CapyLogo from '../components/CapyLogo';

const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState(1250.75);

  const quickActions = [
    { icon: <Receipt />, label: 'Extrato', action: () => navigate('/payments') },
    { icon: <Settings />, label: 'Configurações', action: () => console.log('Configurações') },
    { icon: <Help />, label: 'Ajuda', action: () => console.log('Ajuda') },
    { icon: <QrCodeScanner />, label: 'Pagar', action: () => console.log('Pagar') },
  ];

  const recentTransactions = [
    { id: 1, type: 'received', amount: 150.00, description: 'Recebido de João Silva', time: '14:30' },
    { id: 2, type: 'sent', amount: 89.50, description: 'Pagamento - Restaurante', time: '12:15' },
    { id: 3, type: 'received', amount: 320.00, description: 'Depósito PIX', time: '09:45' },
  ];

  const features = [
    {
      icon: <TrendingUp sx={{ color: '#5FBEAA', fontSize: 32 }} />,
      title: 'Investimentos',
      description: 'Faça seu dinheiro render'
    },
    {
      icon: <AccountBalance sx={{ color: '#B8860B', fontSize: 32 }} />,
      title: 'Conta Digital',
      description: 'Sem taxas, sem complicação'
    },
    {
      icon: <Security sx={{ color: '#1E3A8A', fontSize: 32 }} />,
      title: 'Segurança',
      description: 'Seus dados protegidos'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F0F9F7 0%, #FFFFFF 100%)',
      pb: 4
    }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {/* Header com Logo */}
        <Paper 
          elevation={0} 
          sx={{ 
            background: 'linear-gradient(135deg, #5FBEAA 0%, #4A9688 100%)',
            borderRadius: '0 0 32px 32px',
            p: 3,
            mb: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CapyLogo 
                  size={48} 
                  variant="white"
                  animated={true}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Capy Pay
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Olá, Felipe!
                  </Typography>
                </Box>
              </Stack>
              <IconButton sx={{ color: 'white' }}>
                <Notifications />
              </IconButton>
            </Stack>

            {/* Saldo */}
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                Saldo disponível
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '2rem', sm: '2.5rem' }
                  }}
                >
                  {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setShowBalance(!showBalance)}
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {showBalance ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* Botões Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Send />}
              onClick={() => navigate('/payments')}
              sx={{
                bgcolor: '#B8860B',
                color: 'white',
                py: 2,
                borderRadius: 4,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#8B6914',
                }
              }}
            >
              Enviar BRZ
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GetApp />}
              onClick={() => navigate('/payments')}
              sx={{
                borderColor: '#B8860B',
                color: '#B8860B',
                py: 2,
                borderRadius: 4,
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#8B6914',
                  color: '#8B6914',
                  bgcolor: 'rgba(184, 134, 11, 0.05)',
                }
              }}
            >
              Receber BRZ
            </Button>
          </Grid>
        </Grid>

        {/* Ações Rápidas */}
        <Card sx={{ mb: 3, bgcolor: 'white' }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={3} key={index}>
                  <Stack 
                    alignItems="center" 
                    spacing={1}
                    sx={{ 
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(95, 190, 170, 0.1)',
                      }
                    }}
                    onClick={action.action}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: 'rgba(95, 190, 170, 0.1)',
                        color: '#5FBEAA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 500,
                        color: '#1E3A8A',
                        textAlign: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      {action.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card sx={{ mb: 3, bgcolor: 'white' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                  Transações Recentes
                </Typography>
                <Button 
                  size="small" 
                  sx={{ color: '#5FBEAA' }}
                  onClick={() => navigate('/payments')}
                >
                  Ver todas
                </Button>
              </Stack>
            </Box>
            <Divider sx={{ mx: 2 }} />
            <Box sx={{ p: 2, pt: 1 }}>
              <Stack spacing={2}>
                {recentTransactions.map((transaction) => (
                  <Stack 
                    key={transaction.id}
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ 
                      p: 1,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'rgba(95, 190, 170, 0.05)',
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: transaction.type === 'received' ? 'rgba(95, 190, 170, 0.1)' : 'rgba(184, 134, 11, 0.1)',
                          color: transaction.type === 'received' ? '#5FBEAA' : '#B8860B'
                        }}
                      >
                        {transaction.type === 'received' ? <GetApp /> : <Send />}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ fontWeight: 500, color: '#1E3A8A' }}
                        >
                          {transaction.description}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: '#64748B' }}
                        >
                          {transaction.time}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: transaction.type === 'received' ? '#5FBEAA' : '#B8860B'
                      }}
                    >
                      {transaction.type === 'received' ? '+' : '-'} R$ {transaction.amount.toFixed(2).replace('.', ',')}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Funcionalidades */}
        <Card sx={{ bgcolor: 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A', mb: 2 }}>
              Explore mais
            </Typography>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(95, 190, 170, 0.05)',
                      }
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ fontWeight: 600, color: '#1E3A8A' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#64748B' }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
