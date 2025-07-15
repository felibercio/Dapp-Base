import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tab, 
  Tabs, 
  Paper 
} from '@mui/material';
import { 
  AccountBalance, 
  Payment, 
  Receipt, 
  TrendingUp,
  Rocket,
  Eco
} from '@mui/icons-material';
import PixInterface from '../components/PixInterface';
import TransactionReceipt from '../components/TransactionReceipt';
import AppchainMonitor from '../components/AppchainMonitor';
import BaseEcosystemDashboard from '../components/BaseEcosystemDashboard';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTransactionComplete = (data) => {
    setTransactionData(data);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setTransactionData(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas transações PIX e BRLA
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
            <Tab 
              icon={<AccountBalance />} 
              label="PIX Interface" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<Payment />} 
              label="Pagamentos" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<Receipt />} 
              label="Histórico" 
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<TrendingUp />} 
              label="Analytics" 
              {...a11yProps(3)} 
            />
            <Tab 
              icon={<Rocket />} 
              label="Appchain Monitor" 
              {...a11yProps(4)} 
            />
            <Tab 
              icon={<Eco />} 
              label="Base Ecosystem" 
              {...a11yProps(5)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <PixInterface onTransactionComplete={handleTransactionComplete} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Pagamentos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Funcionalidade em desenvolvimento
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Transações
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Funcionalidade em desenvolvimento
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Funcionalidade em desenvolvimento
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={4}>
          <AppchainMonitor />
        </TabPanel>

        <TabPanel value={value} index={5}>
          <BaseEcosystemDashboard />
        </TabPanel>
      </Paper>

      {/* Modal do Comprovante */}
      {showReceipt && transactionData && (
        <TransactionReceipt 
          open={showReceipt}
          onClose={handleCloseReceipt}
          transactionData={transactionData}
        />
      )}
    </Container>
  );
};

export default Dashboard;
