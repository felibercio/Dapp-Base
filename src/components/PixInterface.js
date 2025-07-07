import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
  Badge,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  SwapHoriz,
  QrCode,
  Receipt,
  Share,
  Security,
  AttachMoney,
  AccountBalance,
  CreditCard,
  TrendingUp,
  LocalAtm,
  Menu as MenuIcon,
  Notifications,
  Home,
  Person,
  Business,
  MonetizationOn,
  Savings,
  BarChart,
  CurrencyExchange,
  ExitToApp,
  ArrowForwardIos,
  Warning
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { usePixBrla } from '../hooks/usePixBrla';
import TransactionReceipt from './TransactionReceipt';

// Styled Components baseados no design do Sicredi
const AppContainer = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
  position: 'relative',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1B365D 0%, #2E4F73 100%)',
  color: 'white',
  padding: theme.spacing(2, 2, 3, 2),
  position: 'relative',
}));

const StatusBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const AccountInfo = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  opacity: 0.9,
  marginTop: theme.spacing(0.5),
}));

const SecurityAlert = styled(Alert)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: '#FFF3CD',
  border: '1px solid #FFEAA7',
  '& .MuiAlert-icon': {
    color: '#856404',
  },
  '& .MuiAlert-message': {
    color: '#856404',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  border: '1px solid #E9ECEF',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const PixCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: 16,
  background: 'linear-gradient(135deg, #1B365D 0%, #2E4F73 100%)',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const MenuContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1B365D 0%, #2E4F73 100%)',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const MenuList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .MuiListItemButton-root': {
    borderRadius: 12,
    margin: theme.spacing(0.5, 0),
    padding: theme.spacing(1.5, 2),
    '&:hover': {
      backgroundColor: '#F8F9FA',
    },
  },
}));

const PixInterface = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showMenu, setShowMenu] = useState(false);
  const [pixAmount, setPixAmount] = useState('');
  const [brlaAmount, setBrlaAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [notification, setNotification] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  
  // Hook personalizado para PIX/BRLA
  const {
    isLoading,
    walletConnected,
    walletAddress,
    brlaBalance,
    transactions,
    error,
    connectWallet: connectWalletHook,
    disconnectWallet,
    processPixToBrla,
    processBrlaToPixConversion,
    validatePixKey,
    clearError
  } = usePixBrla();

  const menuItems = [
    { id: 'home', icon: <Home />, label: 'Início' },
    { id: 'profile', icon: <Person />, label: 'Meu Perfil' },
    { id: 'assemblies', icon: <Business />, label: 'Assembleias' },
    { id: 'account', icon: <AccountBalanceWallet />, label: 'Conta Corrente' },
    { id: 'payments', icon: <Payment />, label: 'Pagamentos' },
    { id: 'pix', icon: <QrCode />, label: 'Pix' },
    { id: 'transfers', icon: <SwapHoriz />, label: 'Transferências' },
    { id: 'cards', icon: <CreditCard />, label: 'Cartões' },
    { id: 'investments', icon: <TrendingUp />, label: 'Investimentos' },
    { id: 'pension', icon: <Savings />, label: 'Previdência' },
    { id: 'credit', icon: <MonetizationOn />, label: 'Crédito' },
    { id: 'consortiums', icon: <Business />, label: 'Consórcios' },
  ];

  const homeServices = [
    { id: 'balance', icon: <AccountBalanceWallet />, label: 'Saldo' },
    { id: 'cards', icon: <CreditCard />, label: 'Cartões' },
    { id: 'investments', icon: <BarChart />, label: 'Investimentos' },
    { id: 'credit', icon: <CurrencyExchange />, label: 'Crédito' },
  ];

  const handlePixToBrla = async () => {
    if (!pixAmount || !walletConnected) {
      setNotification('Por favor, conecte sua wallet e insira um valor válido');
      return;
    }

    try {
      const result = await processPixToBrla({
        amount: parseFloat(pixAmount),
        payerCpf: '00000000000',
        payerName: 'Usuário Dapp'
      });
      
      setTransactionData({
        type: 'PIX_TO_BRLA',
        pixAmount: parseFloat(pixAmount),
        brlaAmount: parseFloat(pixAmount),
        timestamp: new Date().toISOString(),
        transactionHash: result.transactionHash || 'mock_hash_' + Date.now(),
        status: 'success'
      });
      
      setShowReceipt(true);
      setNotification('PIX convertido para BRLA com sucesso!');
      setPixAmount('');
    } catch (error) {
      setNotification(error.message || 'Erro na transação. Tente novamente.');
    }
  };

  const handleBrlaToPix = async () => {
    if (!brlaAmount || !pixKey || !walletConnected) {
      setNotification('Por favor, preencha todos os campos e conecte sua wallet');
      return;
    }

    try {
      const validation = await validatePixKey(pixKey);
      if (!validation.isValid) {
        setNotification(validation.error);
        return;
      }

      const result = await processBrlaToPixConversion({
        amount: parseFloat(brlaAmount),
        pixKey: pixKey
      });
      
      setTransactionData({
        type: 'BRLA_TO_PIX',
        brlaAmount: parseFloat(brlaAmount),
        pixAmount: parseFloat(brlaAmount),
        pixKey: pixKey,
        timestamp: new Date().toISOString(),
        transactionHash: result.transactionHash || 'mock_hash_' + Date.now(),
        status: 'success'
      });
      
      setShowReceipt(true);
      setNotification('BRLA convertido para PIX com sucesso!');
      setBrlaAmount('');
      setPixKey('');
    } catch (error) {
      setNotification(error.message || 'Erro na conversão. Tente novamente.');
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWalletHook();
      setNotification('Wallet conectada com sucesso!');
    } catch (error) {
      setNotification(error.message || 'Erro ao conectar wallet');
    }
  };

  const handleShareTransaction = () => {
    setNotification('Compartilhado no X! Você ganhou vantagens!');
    setShowReceipt(false);
  };

  const handleCopyNotification = (message) => {
    setNotification(message);
  };

  const renderHome = () => (
    <Box>
      <HeaderContainer>
        <StatusBar>
          <Typography variant="body2">14:16</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">••</Typography>
            <Typography variant="body2">📶</Typography>
            <Typography variant="body2">84%</Typography>
          </Box>
        </StatusBar>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton onClick={() => setShowMenu(true)} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Super Dapp Base
          </Typography>
          <Badge badgeContent={3} color="error">
            <IconButton sx={{ color: 'white' }}>
              <Notifications />
            </IconButton>
          </Badge>
        </Box>
        
        <WelcomeSection>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Olá, Priscila
          </Typography>
          <AccountInfo>
            0710 / 59942-3
          </AccountInfo>
        </WelcomeSection>
      </HeaderContainer>

      <SecurityAlert 
        severity="warning" 
        icon={<Warning />}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Atenção com ligações ou SMS sobre transação não reconhecida.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Não compartilhe seus dados. Dúvida, contate nossos canais oficiais.
        </Typography>
        <Box display="flex" gap={1}>
          <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}>
            Entre em contato
          </Button>
          <Button size="small" variant="contained" sx={{ fontSize: '0.75rem' }}>
            Entendi
          </Button>
        </Box>
      </SecurityAlert>

      <Box sx={{ mt: 2 }}>
        {homeServices.map((service) => (
          <ServiceCard key={service.id}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#1B365D', width: 40, height: 40 }}>
                    {service.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
                    {service.label}
                  </Typography>
                </Box>
                <ArrowForwardIos sx={{ color: '#6C757D', fontSize: 16 }} />
              </Box>
            </CardContent>
          </ServiceCard>
        ))}
      </Box>

      <PixCard onClick={() => setSelectedTab('pix')}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
              <LocalAtm sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Pix Automático: prático e seguro
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Pagamentos periódicos via Pix!
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </PixCard>
    </Box>
  );

  const renderPix = () => (
    <Box>
      <HeaderContainer>
        <StatusBar>
          <Typography variant="body2">14:16</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">••</Typography>
            <Typography variant="body2">📶</Typography>
            <Typography variant="body2">84%</Typography>
          </Box>
        </StatusBar>
        
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => setSelectedTab('home')} sx={{ color: 'white' }}>
            <ArrowForwardIos sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            PIX ↔ BRLA
          </Typography>
        </Box>
      </HeaderContainer>

      <Box sx={{ p: 2 }}>
        {/* Status da Wallet */}
        <ServiceCard sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Security sx={{ color: walletConnected ? '#28a745' : '#dc3545' }} />
                <Typography variant="body1" sx={{ color: '#1B365D' }}>
                  Wallet {walletConnected ? 'Conectada' : 'Desconectada'}
                </Typography>
              </Box>
              {!walletConnected && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleConnectWallet}
                  disabled={isLoading}
                  sx={{ 
                    bgcolor: '#1B365D',
                    '&:hover': { bgcolor: '#2E4F73' }
                  }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Conectar'}
                </Button>
              )}
            </Box>
            {walletConnected && (
              <Typography variant="body2" sx={{ color: '#6C757D', mt: 1 }}>
                Saldo BRLA: {brlaBalance} BRLA
              </Typography>
            )}
          </CardContent>
        </ServiceCard>

        {/* PIX para BRLA */}
        <ServiceCard sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Payment sx={{ color: '#1B365D' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
                PIX → BRLA
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Valor em R$"
              value={pixAmount}
              onChange={(e) => setPixAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1B365D',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1B365D',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handlePixToBrla}
              disabled={!walletConnected || isLoading}
              sx={{ 
                borderRadius: 2, 
                py: 1.5,
                bgcolor: '#1B365D',
                '&:hover': { bgcolor: '#2E4F73' },
                '&:disabled': { bgcolor: '#6C757D' }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar PIX e Receber BRLA'}
            </Button>
          </CardContent>
        </ServiceCard>

        {/* BRLA para PIX */}
        <ServiceCard sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CurrencyExchange sx={{ color: '#1B365D' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
                BRLA → PIX
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Valor em BRLA"
              value={brlaAmount}
              onChange={(e) => setBrlaAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">BRLA</InputAdornment>,
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1B365D',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1B365D',
                },
              }}
            />
            <TextField
              fullWidth
              label="Chave PIX de destino"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1B365D',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1B365D',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleBrlaToPix}
              disabled={!walletConnected || isLoading}
              sx={{ 
                borderRadius: 2, 
                py: 1.5,
                bgcolor: '#1B365D',
                '&:hover': { bgcolor: '#2E4F73' },
                '&:disabled': { bgcolor: '#6C757D' }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Converter BRLA para PIX'}
            </Button>
          </CardContent>
        </ServiceCard>
      </Box>
    </Box>
  );

  const renderMenu = () => (
    <MenuContainer>
      <MenuHeader>
        <IconButton onClick={() => setShowMenu(false)} sx={{ color: 'white' }}>
          <ArrowForwardIos sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Super Dapp Base
        </Typography>
      </MenuHeader>

      <MenuList>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => {
                setSelectedTab(item.id);
                setShowMenu(false);
              }}
            >
              <ListItemIcon sx={{ color: '#1B365D', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: 500,
                    color: '#1B365D'
                  } 
                }}
              />
              <ArrowForwardIos sx={{ color: '#6C757D', fontSize: 16 }} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2, mx: 2 }} />
        
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: '#dc3545', minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText 
              primary="Sair da conta"
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: 500,
                  color: '#dc3545'
                } 
              }}
            />
          </ListItemButton>
        </ListItem>
      </MenuList>
    </MenuContainer>
  );

  return (
    <AppContainer>
      {showMenu ? renderMenu() : selectedTab === 'pix' ? renderPix() : renderHome()}
      
      <TransactionReceipt
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        transactionData={transactionData}
        onShare={handleShareTransaction}
        onCopy={handleCopyNotification}
      />
      
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification('')}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </AppContainer>
  );
};

export default PixInterface; 