import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AttachMoney,
  Rocket,
  EmojiEvents,
  Group,
  Code,
  TrendingUp,
  CheckCircle,
  Schedule,
  Launch,
  Info,
  Assignment,
  Visibility,
  Build,
  AccountBalance,
} from '@mui/icons-material';
import {
  BASE_FUNDING_PROGRAMS,
  BASE_DISTRIBUTION_CHANNELS,
  BASE_TOOLS_INTEGRATION,
  BASE_INTEGRATION_ROADMAP,
  generateFundingReport,
  getNextMilestones,
  calculateBuilderScore,
} from '../config/baseEcosystem';

const BaseEcosystemDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showFundingDialog, setShowFundingDialog] = useState(false);
  const [fundingReport, setFundingReport] = useState(null);
  const [builderScore, setBuilderScore] = useState(0);

  useEffect(() => {
    // Simular cálculo do Builder Score
    const mockMetrics = {
      contractDeployments: 75,
      transactionVolume: 60,
      uniqueUsers: 45,
      codeQuality: 85,
      communityEngagement: 30
    };
    setBuilderScore(calculateBuilderScore(mockMetrics));
  }, []);

  const handleFundingAnalysis = () => {
    const report = generateFundingReport();
    setFundingReport(report);
    setShowFundingDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'success';
      case 'applied': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'evaluating': return 'info';
      case 'planning': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircle color="success" />;
      case 'applied': return <Schedule color="warning" />;
      case 'approved': return <EmojiEvents color="success" />;
      case 'rejected': return <Info color="error" />;
      case 'evaluating': return <Visibility color="info" />;
      case 'planning': return <Assignment color="action" />;
      default: return <Schedule color="action" />;
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`base-tabpanel-${index}`}
      aria-labelledby={`base-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img 
          src="https://docs.base.org/img/logo.svg" 
          alt="Base Logo" 
          style={{ width: 32, height: 32 }}
        />
        Base Ecosystem Integration
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          🚀 Base é a Layer 2 #1 do Ethereum, incubada pela Coinbase. 
          Integre-se ao ecossistema para acessar funding, distribuição e ferramentas avançadas.
        </Typography>
      </Alert>

      {/* Builder Score */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #0052FF 0%, #1E3A8A 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Builder Score
              </Typography>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {builderScore.toFixed(0)}/100
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Sua pontuação no ecossistema Base
              </Typography>
            </Box>
            <Box sx={{ width: '40%' }}>
              <LinearProgress
                variant="determinate"
                value={builderScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<AttachMoney />} label="Funding Programs" />
        <Tab icon={<Rocket />} label="Distribution" />
        <Tab icon={<Build />} label="Tools & Services" />
        <Tab icon={<Assignment />} label="Roadmap" />
      </Tabs>

      {/* Funding Programs Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Programas de Financiamento</Typography>
          <Button 
            variant="contained" 
            startIcon={<AttachMoney />}
            onClick={handleFundingAnalysis}
          >
            Analisar Oportunidades
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Object.entries(BASE_FUNDING_PROGRAMS).map(([key, program]) => (
            <Grid item xs={12} md={6} key={key}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {program.name}
                    </Typography>
                    <Chip 
                      icon={getStatusIcon(program.applicationStatus)}
                      label={program.applicationStatus}
                      color={getStatusColor(program.applicationStatus)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {program.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      Até {program.maxReward}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {program.estimatedReward}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => setSelectedProgram(program)}
                    >
                      Detalhes
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      href={program.platform}
                      target="_blank"
                      startIcon={<Launch />}
                    >
                      Aplicar
                    </Button>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {program.requirements.slice(0, 2).join(' • ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Distribution Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h5" gutterBottom>Canais de Distribuição</Typography>
        
        <Grid container spacing={3}>
          {Object.entries(BASE_DISTRIBUTION_CHANNELS).map(([key, channel]) => (
            <Grid item xs={12} md={4} key={key}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {channel.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {channel.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={channel.implementation.status}
                      color={getStatusColor(channel.implementation.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${channel.implementation.priority} priority`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Usuários estimados: {channel.implementation.estimatedUsers}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Timeline: {channel.implementation.timeline}
                  </Typography>

                  <Button 
                    size="small" 
                    variant="outlined"
                    href={channel.platform}
                    target="_blank"
                    startIcon={<Launch />}
                    fullWidth
                  >
                    Saiba Mais
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tools & Services Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h5" gutterBottom>Ferramentas & Serviços</Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ferramenta</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Benefícios</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(BASE_TOOLS_INTEGRATION).map(([key, tool]) => (
                <TableRow key={key}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{tool.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tool.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tool.implementation.status}
                      color={getStatusColor(tool.implementation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tool.implementation.priority}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {tool.benefits.slice(0, 2).join(' • ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver documentação">
                      <IconButton 
                        size="small"
                        href={tool.documentation}
                        target="_blank"
                      >
                        <Launch />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Roadmap Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h5" gutterBottom>Roadmap de Integração</Typography>
        
        <Grid container spacing={3}>
          {Object.entries(BASE_INTEGRATION_ROADMAP).map(([key, phase]) => (
            <Grid item xs={12} md={6} key={key}>
              <Card sx={{ 
                height: '100%',
                border: phase.status === 'in_progress' ? '2px solid #0052FF' : 'none'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{phase.name}</Typography>
                    <Chip 
                      label={phase.status}
                      color={getStatusColor(phase.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Duração: {phase.duration}
                  </Typography>

                  <List dense>
                    {phase.milestones.map((milestone, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText 
                          primary={milestone}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Próximos Marcos
            </Typography>
            <List>
              {getNextMilestones().map((milestone, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={milestone.replace(/^[🔄⏳]\s*/, '')} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Funding Analysis Dialog */}
      <Dialog 
        open={showFundingDialog} 
        onClose={() => setShowFundingDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="primary" />
            Análise de Oportunidades de Funding
          </Box>
        </DialogTitle>
        <DialogContent>
          {fundingReport && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  💰 Potencial total de funding: {fundingReport.totalPotentialFunding}
                </Typography>
              </Alert>

              <Typography variant="h6" gutterBottom>
                Programas Elegíveis:
              </Typography>
              <List>
                {fundingReport.eligiblePrograms.map((program, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={BASE_FUNDING_PROGRAMS[program].name}
                      secondary={BASE_FUNDING_PROGRAMS[program].estimatedReward}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Próximas Ações:
              </Typography>
              <List>
                {fundingReport.nextActions.map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Assignment color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Timeline estimado: {fundingReport.timeline}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFundingDialog(false)}>
            Fechar
          </Button>
          <Button 
            variant="contained"
            href="https://www.builderscore.xyz/"
            target="_blank"
          >
            Começar Aplicações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Program Details Dialog */}
      {selectedProgram && (
        <Dialog 
          open={!!selectedProgram} 
          onClose={() => setSelectedProgram(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedProgram.name}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedProgram.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Requisitos:
            </Typography>
            <List>
              {selectedProgram.requirements.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Critérios de Elegibilidade:
            </Typography>
            <List>
              {Object.entries(selectedProgram.eligibility).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    secondary={value.toString()}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProgram(null)}>
              Fechar
            </Button>
            <Button 
              variant="contained"
              href={selectedProgram.platform}
              target="_blank"
            >
              Aplicar Agora
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default BaseEcosystemDashboard; 