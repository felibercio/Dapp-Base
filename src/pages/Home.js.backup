import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Payment, 
  TrendingUp, 
  Security,
  QrCode,
  Speed,
  Shield,
  Language,
  ArrowForward
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <Shield sx={{ fontSize: 40, color: '#4F46E5' }} />,
      title: 'Privado e à prova de fraudes',
      description: 'Mantenha-se totalmente protegido, pois o zkKYC mínimo verifica sua identidade sem expor informações confidenciais. Experimente uma prevenção robusta contra fraudes com uma abordagem que prioriza a privacidade nas transações P2P.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#4F46E5' }} />,
      title: 'Extremamente rápido',
      description: 'Experimente trocas quase instantâneas, impulsionadas por uma rede global de pares. Aproveite tempos de espera mínimos e um fluxo de pagamento tranquilo.'
    },
    {
      icon: <Language sx={{ fontSize: 40, color: '#4F46E5' }} />,
      title: 'Descentralizado',
      description: 'Opera como um protocolo aberto, onde nenhuma autoridade central pode controlar ou censurar transações. Você mantém a propriedade absoluta dos seus ativos.'
    }
  ];

  const integrations = [
    { name: 'Coinbase', color: '#0052FF' },
    { name: 'Rupee', color: '#FF6B35' },
    { name: 'Ethereum', color: '#627EEA' },
    { name: 'Base', color: '#0052FF' },
    { name: 'Binance', color: '#F3BA2F' },
    { name: 'Polygon', color: '#8247E5' },
    { name: 'Solana', color: '#9945FF' },
    { name: 'USDC', color: '#2775CA' }
  ];

  const faqs = [
    "Como o P2P aborda o problema do 'congelamento bancário'?",
    "O que é RP (Pontos de Reputação) no P2P.me?",
    "Quantas transações posso fazer?",
    "Quais são os horários preferenciais para usar o P2P.me?",
    "O P2P.me deduzirá impostos de suas transações?",
    "O KYC é obrigatório?",
    "Quem está construindo o protocolo P2P.me?",
    "O P2P.me está em conformidade com as diretrizes do GAFI para prevenir a lavagem de dinheiro?",
    "Os comerciantes no P2P.me são verificados?",
    "O P2P.me ajudará os usuários com a conformidade legal?"
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Super Dapp Base
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Sua porta de entrada para o futuro das finanças descentralizadas
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ mt: 2, mr: 2 }}
          >
            Começar Agora
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            sx={{ mt: 2 }}
          >
            Saiba Mais
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button size="small">Explorar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Construído na Base
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Aproveitando a velocidade e baixo custo da rede Base para 
            oferecer a melhor experiência em DeFi
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
