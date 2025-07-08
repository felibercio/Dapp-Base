import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Paper,
  Stack,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
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
  ArrowForward,
  ExpandMore,
  CheckCircle,
  SwapHoriz,
  LocalAtm,
  AccountBalance,
  Lock,
  FlashOn,
  Public,
  Verified
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Shield sx={{ fontSize: 48, color: '#4F46E5' }} />,
      title: 'Privado e à prova de fraudes',
      description: 'Mantenha-se totalmente protegido, pois o zkKYC mínimo verifica sua identidade sem expor informações confidenciais. Experimente uma prevenção robusta contra fraudes com uma abordagem que prioriza a privacidade nas transações P2P.',
      color: '#4F46E5'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#06B6D4' }} />,
      title: 'Extremamente rápido',
      description: 'Experimente trocas quase instantâneas, impulsionadas por uma rede global de pares. Aproveite tempos de espera mínimos e um fluxo de pagamento tranquilo.',
      color: '#06B6D4'
    },
    {
      icon: <Public sx={{ fontSize: 48, color: '#8B5CF6' }} />,
      title: 'Descentralizado',
      description: 'Opera como um protocolo aberto, onde nenhuma autoridade central pode controlar ou censurar transações. Você mantém a propriedade absoluta dos seus ativos.',
      color: '#8B5CF6'
    }
  ];

  const integrations = [
    { name: 'Coinbase', color: '#0052FF', verified: true },
    { name: 'Base Network', color: '#0052FF', verified: true },
    { name: 'Ethereum', color: '#627EEA', verified: true },
    { name: 'BRLA', color: '#00D4AA', verified: true },
    { name: 'PIX', color: '#32BCAD', verified: true },
    { name: 'MetaMask', color: '#F6851B', verified: true },
    { name: 'WalletConnect', color: '#3B99FC', verified: true },
    { name: 'RainbowKit', color: '#FF6B6B', verified: true }
  ];

  const paymentMethods = [
    {
      icon: <QrCode sx={{ fontSize: 32, color: '#4F46E5' }} />,
      title: 'Pagamentos QR',
      description: 'Escaneie QR codes para pagamentos instantâneos'
    },
    {
      icon: <SwapHoriz sx={{ fontSize: 32, color: '#06B6D4' }} />,
      title: 'Conversão PIX ↔ BRLA',
      description: 'Converta entre PIX e BRLA automaticamente'
    },
    {
      icon: <LocalAtm sx={{ fontSize: 32, color: '#10B981' }} />,
      title: 'Staking Rewards',
      description: 'Ganhe recompensas fazendo staking de BRLA'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 32, color: '#8B5CF6' }} />,
      title: 'DeFi Integration',
      description: 'Acesse protocolos DeFi na Base Network'
    }
  ];

  const faqs = [
    {
      question: "Como o Super Dapp Base funciona?",
      answer: "O Super Dapp Base é uma aplicação descentralizada que permite conversões entre PIX brasileiro e BRLA (stablecoin) na rede Base. Você pode fazer pagamentos PIX, converter para BRLA e participar de staking para ganhar recompensas."
    },
    {
      question: "O que é BRLA?",
      answer: "BRLA é uma stablecoin brasileira pareada ao Real (BRL) que roda na rede Base. É uma moeda digital estável que mantém seu valor próximo ao Real brasileiro."
    },
    {
      question: "Como conectar minha carteira?",
      answer: "Você pode conectar sua carteira MetaMask ou qualquer carteira compatível com WalletConnect. Certifique-se de estar na rede Base para usar todas as funcionalidades."
    },
    {
      question: "Quais são as taxas?",
      answer: "As taxas são mínimas graças à eficiência da rede Base. Conversões PIX para BRLA têm taxa de 0,1% e operações de staking são gratuitas para depósitos."
    },
    {
      question: "É seguro usar o Super Dapp Base?",
      answer: "Sim, o Super Dapp Base é construído com as melhores práticas de segurança. Suas chaves privadas ficam sempre com você, e todos os contratos são auditados."
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)'
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1B365D 0%, #4F46E5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Pague com BRLA
            <br />
            em qualquer QR
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748B',
              fontWeight: 400,
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Trocas de PIX ↔ BRLA tão rápidas que você pode pagar em qualquer loja.
            <br />
            Risco zero de congelamento bancário.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
              endIcon={<ArrowForward />}
            >
              Começar Agora
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/payments')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderColor: '#4F46E5',
                color: '#4F46E5',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              Ver Pagamentos
            </Button>
          </Stack>

          {/* Hero Image Placeholder */}
          <Box sx={{ 
            position: 'relative',
            maxWidth: '500px',
            mx: 'auto',
            mt: 4
          }}>
            <Paper sx={{ 
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <QrCode sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Escaneie e Pague
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Pagamentos instantâneos com BRLA
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: '#1E293B'
            }}
          >
            Integração perfeita entre
            <br />
            cadeias e moedas
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: '#64748B',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Compre ou venda BRLA facilmente em diversas redes com
            moedas fiduciárias — rápido, seguro e sem complicações.
          </Typography>

          <Grid container spacing={4}>
            {mainFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: '#1E293B'
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748B',
                      lineHeight: 1.6
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Payment Methods Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              color: '#1E293B'
            }}
          >
            Métodos de Pagamento
          </Typography>

          <Grid container spacing={3}>
            {paymentMethods.map((method, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Box sx={{ mb: 2 }}>
                    {method.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    color: '#1E293B'
                  }}>
                    {method.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#64748B'
                  }}>
                    {method.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Integrations Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              color: '#1E293B'
            }}
          >
            Integrações Suportadas
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {integrations.map((integration, index) => (
              <Grid item key={index}>
                <Chip
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: integration.color,
                      color: 'white',
                      fontSize: '0.8rem'
                    }}>
                      {integration.name[0]}
                    </Avatar>
                  }
                  label={integration.name}
                  variant="outlined"
                  icon={integration.verified ? <Verified /> : undefined}
                  sx={{ 
                    py: 2,
                    px: 1,
                    borderRadius: 2,
                    borderColor: '#E2E8F0',
                    '& .MuiChip-label': {
                      fontWeight: 500
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              color: '#1E293B'
            }}
          >
            Perguntas Frequentes
          </Typography>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <Accordion 
                key={index}
                sx={{ 
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  '&:before': { display: 'none' },
                  boxShadow: 'none'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    py: 2,
                    '& .MuiAccordionSummary-content': {
                      my: 1
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#1E293B'
                  }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body1" sx={{ 
                    color: '#64748B',
                    lineHeight: 1.6
                  }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          py: 8,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          borderRadius: 4,
          color: 'white',
          mb: 8
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            mb: 2
          }}>
            Pronto para começar?
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4,
            opacity: 0.9
          }}>
            Conecte sua carteira e comece a usar o futuro dos pagamentos
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)'
              }
            }}
            endIcon={<ArrowForward />}
          >
            Conectar Carteira
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
