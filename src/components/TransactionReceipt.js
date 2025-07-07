import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  Link
} from '@mui/material';
import {
  Receipt,
  Share,
  Close,
  CheckCircle,
  ContentCopy,
  Launch
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  backgroundColor: '#F8F9FA',
  borderRadius: 12,
  border: '1px solid #E9ECEF',
}));

const SuccessIcon = styled(CheckCircle)(({ theme }) => ({
  fontSize: 60,
  color: '#1B365D',
  marginBottom: theme.spacing(2),
}));

const TransactionReceipt = ({ 
  open, 
  onClose, 
  transactionData,
  onShare,
  onCopy 
}) => {
  if (!transactionData) return null;

  const {
    type,
    amount,
    pixAmount,
    brlaAmount,
    pixKey,
    transactionHash,
    timestamp,
    status = 'success',
    explorerUrl,
    fees = 0
  } = transactionData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCopyHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
      onCopy && onCopy('Hash da transação copiado!');
    }
  };

  const handleShare = () => {
    const shareText = `🎉 Transação realizada com sucesso no Super Dapp Base!

💰 Valor: ${formatCurrency(amount || pixAmount || brlaAmount)}
🔄 Tipo: ${type === 'PIX_TO_BRLA' ? 'PIX → BRLA' : 'BRLA → PIX'}
📅 Data: ${formatDate(timestamp)}

#SuperDappBase #PIX #BRLA #DeFi #Base`;

    if (navigator.share) {
      navigator.share({
        title: 'Transação Super Dapp Base',
        text: shareText,
        url: explorerUrl
      });
    } else {
      // Fallback para desktop - abrir Twitter
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    }
    
    onShare && onShare();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          bgcolor: '#FFFFFF'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', position: 'relative', pb: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#6C757D'
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SuccessIcon />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
            Transação Concluída!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sua transação foi processada com sucesso
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <StyledPaper elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tipo de Transação
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
              {type === 'PIX_TO_BRLA' ? 'PIX → BRLA' : 'BRLA → PIX'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Valor
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
              {formatCurrency(amount || pixAmount || brlaAmount)}
            </Typography>
          </Box>

          {type === 'PIX_TO_BRLA' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  PIX Enviado
                </Typography>
                <Typography variant="body1" sx={{ color: '#1B365D' }}>
                  {formatCurrency(pixAmount)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  BRLA Recebido
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
                  {brlaAmount} BRLA
                </Typography>
              </Box>
            </>
          )}

          {type === 'BRLA_TO_PIX' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  BRLA Enviado
                </Typography>
                <Typography variant="body1" sx={{ color: '#1B365D' }}>
                  {brlaAmount} BRLA
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  PIX Recebido
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1B365D' }}>
                  {formatCurrency(pixAmount)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Chave PIX
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  wordBreak: 'break-all',
                  maxWidth: '200px',
                  color: '#1B365D'
                }}>
                  {pixKey}
                </Typography>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Data e Hora
            </Typography>
            <Typography variant="body2" sx={{ color: '#1B365D' }}>
              {formatDate(timestamp)}
            </Typography>
          </Box>

          {fees > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Taxas
              </Typography>
              <Typography variant="body2" sx={{ color: '#1B365D' }}>
                {formatCurrency(fees)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: status === 'success' ? '#1B365D' : '#dc3545',
                fontWeight: 'bold'
              }}
            >
              {status === 'success' ? 'Sucesso' : 'Falha'}
            </Typography>
          </Box>

          {transactionHash && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hash da Transação
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#F8F9FA',
                padding: 1,
                borderRadius: 1,
                gap: 1,
                border: '1px solid #E9ECEF'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    wordBreak: 'break-all',
                    flex: 1,
                    color: '#1B365D'
                  }}
                >
                  {transactionHash}
                </Typography>
                <IconButton size="small" onClick={handleCopyHash} sx={{ color: '#1B365D' }}>
                  <ContentCopy fontSize="small" />
                </IconButton>
                {explorerUrl && (
                  <IconButton 
                    size="small" 
                    onClick={() => window.open(explorerUrl, '_blank')}
                    sx={{ color: '#1B365D' }}
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
        </StyledPaper>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Transação processada na rede Base
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprovante gerado automaticamente
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={handleShare}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            borderColor: '#1B365D',
            color: '#1B365D',
            '&:hover': {
              borderColor: '#2E4F73',
              backgroundColor: 'rgba(27, 54, 93, 0.04)'
            }
          }}
        >
          Compartilhar no X
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            bgcolor: '#1B365D',
            '&:hover': { bgcolor: '#2E4F73' }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionReceipt; 