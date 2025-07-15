// Utilitários de UX para o Capy Pay
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatTime = (time) => {
  const date = new Date();
  const [hours, minutes] = time.split(':');
  date.setHours(hours, minutes, 0, 0);
  
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 6) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const getTransactionIcon = (type) => {
  const icons = {
    received: '↙️',
    sent: '↗️',
    pix: '🏦',
    transfer: '🔄',
    payment: '💳',
    reward: '🎁'
  };
  return icons[type] || '💰';
};

export const getStatusColor = (status) => {
  const colors = {
    completed: '#5FBEAA',
    pending: '#B8860B',
    failed: '#EF4444',
    processing: '#F59E0B'
  };
  return colors[status] || '#64748B';
};

export const vibrate = (pattern = [100]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar:', err);
    return false;
  }
};

export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '🦫',
      badge: '🦫',
      ...options
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const hapticFeedback = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [200],
      success: [100, 50, 100],
      error: [200, 100, 200]
    };
    vibrate(patterns[type]);
  }
};

export const getCapyTips = () => {
  const tips = [
    {
      title: 'Dica da Capy',
      message: 'Mantenha seu saldo sempre visível para facilitar pagamentos rápidos.',
      icon: '💡'
    },
    {
      title: 'Segurança',
      message: 'Nunca compartilhe suas chaves ou senhas com ninguém.',
      icon: '🔒'
    },
    {
      title: 'Economia',
      message: 'Use o staking para fazer seu dinheiro render automaticamente.',
      icon: '💰'
    },
    {
      title: 'Praticidade',
      message: 'Salve seus contatos favoritos para envios mais rápidos.',
      icon: '⚡'
    }
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  const change = end - start;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = start + change * easeOutQuart;
    
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}; 