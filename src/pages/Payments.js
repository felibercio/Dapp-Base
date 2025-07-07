import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Payment,
  QrCode,
  SwapHoriz,
  Receipt,
  AttachMoney,
  AccountBalance,
  TrendingUp,
  Security,
  Speed,
  LocalAtm,
} from '@mui/icons-material';

const Payments = () => {
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');

  const paymentMethods = [
    {
      icon: <QrCode sx={{ fontSize: 40 }} />,
      title: 'PIX QR Code',
      description: 'Escaneie ou gere QR Code para pagamentos instantâneos',
      color: 'primary',
    },
    {
      icon: <SwapHoriz sx={{ fontSize: 40 }} />,
      title: 'PIX → BRLA',
      description: 'Converta PIX para BRLA na rede Base',
      color: 'secondary',
    },
    {
      icon: <LocalAtm sx={{ fontSize: 40 }} />,
      title: 'BRLA → PIX',
      description: 'Converta BRLA para PIX brasileiro',
      color: 'success',
    },
    {
      icon: <Receipt sx={{ fontSize: 40 }} />,
      title: 'Pagamentos Recorrentes',
      description: 'Configure pagamentos automáticos',
      color: 'warning',
    },
  ];

  const features = [
    'Transações instantâneas 24/7',
    'Taxas reduzidas na rede Base',
    'Conversão automática PIX/BRLA',
    'Comprovantes verificáveis',
    'Backup descentralizado',
    'Integração com DeFi',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pagamentos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Realize pagamentos PIX e conversões para BRLA de forma rápida e segura
        </Typography>
      </Box>

      {/* Alerta de Informação */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Conecte sua wallet</strong> para acessar todas as funcionalidades de pagamento
        </Typography>
      </Alert>

      {/* Métodos de Pagamento */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {paymentMethods.map((method, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                <Box sx={{ color: `${method.color}.main`, mb: 2 }}>
                  {method.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  color={method.color}
                >
                  Usar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Seção de Pagamento Rápido */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pagamento Rápido
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, CNPJ, email ou telefone"
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="contained" startIcon={<Payment />}>
                  Pagar PIX
                </Button>
                <Button variant="outlined" startIcon={<SwapHoriz />}>
                  Converter BRLA
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vantagens do Sistema
              </Typography>
              <List dense>
                {features.map((feature, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Security color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estatísticas */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Estatísticas da Rede
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Speed color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">~2s</Typography>
              <Typography variant="body2" color="text.secondary">
                Tempo médio
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <AttachMoney color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">$0.01</Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa média
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUp color="warning" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">99.9%</Typography>
              <Typography variant="body2" color="text.secondary">
                Uptime
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <AccountBalance color="info" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">24/7</Typography>
              <Typography variant="body2" color="text.secondary">
                Disponibilidade
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Payments;
