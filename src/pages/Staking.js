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
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Security,
  Timer,
  MonetizationOn,
  Savings,
  BarChart,
  LocalAtm,
  Lock,
  Unlock,
} from '@mui/icons-material';

const Staking = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState(0);

  const stakingPools = [
    {
      name: 'BRLA Staking',
      apy: '12.5%',
      tvl: '$2.5M',
      token: 'BRLA',
      minStake: '100',
      lockPeriod: '30 dias',
      risk: 'Baixo',
      color: '#4CAF50',
    },
    {
      name: 'ETH-BRLA LP',
      apy: '18.7%',
      tvl: '$1.8M',
      token: 'ETH-BRLA',
      minStake: '0.1',
      lockPeriod: '60 dias',
      risk: 'Médio',
      color: '#FF9800',
    },
    {
      name: 'Base Rewards',
      apy: '25.3%',
      tvl: '$950K',
      token: 'BASE',
      minStake: '50',
      lockPeriod: '90 dias',
      risk: 'Alto',
      color: '#F44336',
    },
  ];

  const userStakes = [
    {
      pool: 'BRLA Staking',
      amount: '1,500 BRLA',
      earned: '45.2 BRLA',
      apy: '12.5%',
      daysLeft: 15,
      status: 'Ativo',
    },
    {
      pool: 'ETH-BRLA LP',
      amount: '0.5 ETH-BRLA',
      earned: '0.023 ETH-BRLA',
      apy: '18.7%',
      daysLeft: 45,
      status: 'Ativo',
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Baixo': return 'success';
      case 'Médio': return 'warning';
      case 'Alto': return 'error';
      default: return 'primary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'success';
      case 'Pendente': return 'warning';
      case 'Finalizado': return 'default';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Faça staking de seus tokens e ganhe recompensas passivas
        </Typography>
      </Box>

      {/* Resumo do Portfolio */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonetizationOn color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">$3,245.67</Typography>
              <Typography variant="body2" color="text.secondary">
                Total em Staking
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">$124.89</Typography>
              <Typography variant="body2" color="text.secondary">
                Recompensas Acumuladas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BarChart color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">15.2%</Typography>
              <Typography variant="body2" color="text.secondary">
                APY Médio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timer color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">30 dias</Typography>
              <Typography variant="body2" color="text.secondary">
                Tempo Médio de Lock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pools de Staking Disponíveis */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Pools de Staking Disponíveis
        </Typography>
        <Grid container spacing={3}>
          {stakingPools.map((pool, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                  border: selectedPool === index ? 2 : 0,
                  borderColor: 'primary.main',
                }}
                onClick={() => setSelectedPool(index)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{pool.name}</Typography>
                    <Avatar sx={{ bgcolor: pool.color, width: 32, height: 32 }}>
                      {pool.token[0]}
                    </Avatar>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">APY</Typography>
                    <Typography variant="h5" color="success.main">{pool.apy}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">TVL: {pool.tvl}</Typography>
                    <Typography variant="body2" color="text.secondary">Min. Stake: {pool.minStake} {pool.token}</Typography>
                    <Typography variant="body2" color="text.secondary">Lock: {pool.lockPeriod}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={pool.risk} 
                      color={getRiskColor(pool.risk)}
                      size="small"
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Lock />}
                    >
                      Stake
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Seção de Staking */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fazer Staking
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Pool selecionado: <strong>{stakingPools[selectedPool].name}</strong>
              </Alert>
              <TextField
                fullWidth
                label="Quantidade"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{stakingPools[selectedPool].token}</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Recompensa estimada (anual): <strong>+{(parseFloat(stakeAmount || 0) * parseFloat(stakingPools[selectedPool].apy) / 100).toFixed(2)} {stakingPools[selectedPool].token}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Lock />}
                  fullWidth
                >
                  Confirmar Staking
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações da Pool
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">APY</Typography>
                <Typography variant="h4" color="success.main">
                  {stakingPools[selectedPool].apy}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Value Locked</Typography>
                <Typography variant="h6">{stakingPools[selectedPool].tvl}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Período de Lock</Typography>
                <Typography variant="body1">{stakingPools[selectedPool].lockPeriod}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Stake Mínimo</Typography>
                <Typography variant="body1">{stakingPools[selectedPool].minStake} {stakingPools[selectedPool].token}</Typography>
              </Box>
              <Chip 
                label={`Risco: ${stakingPools[selectedPool].risk}`}
                color={getRiskColor(stakingPools[selectedPool].risk)}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Meus Stakes */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Meus Stakes
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pool</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Recompensas</TableCell>
                <TableCell>APY</TableCell>
                <TableCell>Tempo Restante</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStakes.map((stake, index) => (
                <TableRow key={index}>
                  <TableCell>{stake.pool}</TableCell>
                  <TableCell>{stake.amount}</TableCell>
                  <TableCell>{stake.earned}</TableCell>
                  <TableCell>{stake.apy}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(90 - stake.daysLeft) / 90 * 100} 
                        sx={{ width: 60 }}
                      />
                      <Typography variant="body2">{stake.daysLeft}d</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={stake.status} 
                      color={getStatusColor(stake.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      startIcon={<MonetizationOn />}
                      disabled={stake.status !== 'Ativo'}
                    >
                      Claim
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Staking;
