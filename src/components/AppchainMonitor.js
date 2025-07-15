import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  AccountBalance,
  People,
  CheckCircle,
  Schedule,
  Info,
  Rocket,
} from '@mui/icons-material';
import { APPCHAIN_CONFIG, shouldMigrateToAppchain, generateMigrationReport } from '../config/appchain';

const AppchainMonitor = () => {
  const [metrics, setMetrics] = useState(APPCHAIN_CONFIG.currentMetrics);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [migrationReport, setMigrationReport] = useState(null);

  // Simular métricas (em produção, viria de APIs reais)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        monthlyTransactions: prev.monthlyTransactions + Math.floor(Math.random() * 100),
        monthlyGasCosts: prev.monthlyGasCosts + Math.random() * 10,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        dailyVolume: prev.dailyVolume + Math.random() * 1000,
        lastUpdated: new Date().toISOString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'warning';
    return 'primary';
  };

  const handleMigrationAnalysis = () => {
    const report = generateMigrationReport();
    setMigrationReport(report);
    setShowMigrationDialog(true);
  };

  const criteria = APPCHAIN_CONFIG.migrationCriteria;
  const shouldMigrate = shouldMigrateToAppchain(metrics);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rocket color="primary" />
        Monitoramento Base Appchain
      </Typography>

      <Alert 
        severity={shouldMigrate ? "success" : "info"} 
        sx={{ mb: 3 }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleMigrationAnalysis}
          >
            Analisar Migração
          </Button>
        }
      >
        {shouldMigrate 
          ? "🎉 Critérios atingidos! Pronto para migrar para Base Appchain"
          : "📊 Monitorando métricas para avaliar migração futura"
        }
      </Alert>

      <Grid container spacing={3}>
        {/* Transações Mensais */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Transações Mensais</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {metrics.monthlyTransactions.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Meta: {criteria.monthlyTransactions.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(metrics.monthlyTransactions, criteria.monthlyTransactions)}
                color={getProgressColor(calculateProgress(metrics.monthlyTransactions, criteria.monthlyTransactions))}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {calculateProgress(metrics.monthlyTransactions, criteria.monthlyTransactions).toFixed(1)}% da meta
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Custos de Gas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Custos de Gas Mensais</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                ${metrics.monthlyGasCosts.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Meta: ${criteria.monthlyGasCosts.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(metrics.monthlyGasCosts, criteria.monthlyGasCosts)}
                color={getProgressColor(calculateProgress(metrics.monthlyGasCosts, criteria.monthlyGasCosts))}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {calculateProgress(metrics.monthlyGasCosts, criteria.monthlyGasCosts).toFixed(1)}% da meta
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Usuários Ativos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Usuários Ativos</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {metrics.activeUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Meta: {criteria.activeUsers.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(metrics.activeUsers, criteria.activeUsers)}
                color={getProgressColor(calculateProgress(metrics.activeUsers, criteria.activeUsers))}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {calculateProgress(metrics.activeUsers, criteria.activeUsers).toFixed(1)}% da meta
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Volume Diário */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Volume Diário</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                ${metrics.dailyVolume.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Meta: ${criteria.dailyVolume.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(metrics.dailyVolume, criteria.dailyVolume)}
                color={getProgressColor(calculateProgress(metrics.dailyVolume, criteria.dailyVolume))}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {calculateProgress(metrics.dailyVolume, criteria.dailyVolume).toFixed(1)}% da meta
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Benefícios da Appchain */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Benefícios da Base Appchain
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">1s</Typography>
                    <Typography variant="caption">Tempo de bloco</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AccountBalance color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">90%</Typography>
                    <Typography variant="caption">Redução de custos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">1000x</Typography>
                    <Typography variant="caption">Throughput dedicado</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">10s</Typography>
                    <Typography variant="caption">Bridging rápido</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Análise de Migração */}
      <Dialog 
        open={showMigrationDialog} 
        onClose={() => setShowMigrationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            Análise de Migração para Base Appchain
          </Box>
        </DialogTitle>
        <DialogContent>
          {migrationReport && (
            <Box>
              <Alert 
                severity={migrationReport.shouldMigrate ? "success" : "info"}
                sx={{ mb: 3 }}
              >
                {migrationReport.shouldMigrate 
                  ? "✅ Recomendação: Migrar para Base Appchain"
                  : "⏳ Recomendação: Aguardar crescimento antes de migrar"
                }
              </Alert>

              <Typography variant="h6" gutterBottom>
                Benefícios Estimados:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalance color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Economia de ${migrationReport.benefits.costSavings.toFixed(0)}% nos custos`}
                    secondary={`ROI: ${migrationReport.benefits.roi.toFixed(1)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Speed color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${migrationReport.benefits.performanceGain}x melhoria na performance`}
                    secondary="Transações mais rápidas e throughput dedicado"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Score de UX: ${migrationReport.benefits.userExperienceScore}/100`}
                    secondary="Experiência do usuário significativamente melhorada"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Próximos Passos:
              </Typography>
              <List dense>
                {migrationReport.nextSteps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Timeline estimado: {migrationReport.timeline}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMigrationDialog(false)}>
            Fechar
          </Button>
          {migrationReport?.shouldMigrate && (
            <Button 
              variant="contained" 
              href="https://app.deform.cc/form/4705840f-d6ae-4a31-b52d-906f89a8e206/?page_number=0"
              target="_blank"
            >
              Aplicar para Beta
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppchainMonitor; 