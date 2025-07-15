# Capy Pay - Aplicativo Financeiro Minimalista

## 🦫 Sobre o Capy Pay

O Capy Pay é um aplicativo financeiro moderno e minimalista, desenvolvido com uma estética limpa e amigável inspirada na tranquilidade da capivara. O design combina funcionalidade fintech com uma experiência visual calma e acolhedora.

## 🎨 Design e Identidade Visual

### Paleta de Cores
- **Verde-turquesa suave (#5FBEAA)**: Cor principal, transmite calma e confiança
- **Marrom quente (#B8860B)**: Detalhes e botões principais, adiciona elegância
- **Azul-marinho escuro (#1E3A8A)**: Tipografia principal, garante legibilidade
- **Fundo verde-turquesa suave (#F0F9F7)**: Fundo principal da aplicação

### Características do Design
- **Minimalista**: Interface limpa sem elementos desnecessários
- **Moderno**: Componentes arredondados e sombras suaves
- **Amigável**: Logo da capivara relaxada e cores acolhedoras
- **Fluído**: Transições suaves e animações discretas

## 🚀 Funcionalidades da Tela Principal

### Header Arredondado
- Logo da capivara com design amigável
- Saudação personalizada ao usuário
- Notificações em tempo real

### Saldo Digital
- Exibição em destaque do saldo da carteira
- Opção de ocultar/mostrar saldo
- Formatação brasileira de moeda

### Botões de Ação
- **Botão Principal**: "Enviar BRZ" em marrom com texto branco
- **Botão Secundário**: "Receber BRZ" em estilo outlined
- Design com bordas arredondadas e efeitos hover

### Ações Rápidas
- **Extrato**: Visualizar transações
- **Configurações**: Personalizar aplicativo
- **Ajuda**: Suporte ao usuário
- **Pagar**: Scanner QR code

### Transações Recentes
- Lista das últimas transações
- Ícones diferenciados para envio/recebimento
- Formatação de valores e horários

## 🛠️ Tecnologias Utilizadas

- **React**: Framework principal
- **Material-UI**: Componentes de interface
- **React Router**: Navegação entre páginas
- **Custom CSS**: Estilos personalizados do Capy Pay

## 🎯 Inspiração Design

O design foi inspirado em aplicativos fintech modernos como:
- **Nubank**: Simplicidade e cores vibrantes
- **PicPay**: Interface intuitiva e amigável
- **Toque único**: Personalidade da capivara relaxada

## 📱 Responsividade

O aplicativo é totalmente responsivo com:
- Adaptação para dispositivos móveis
- Navegação otimizada para touch
- Componentes que se ajustam ao tamanho da tela

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Abrir no navegador
# http://localhost:3000
```

## 📋 Estrutura de Componentes

```
src/
├── components/
│   ├── Navigation.js          # Navbar com tema Capy Pay
│   ├── WalletProvider.js      # Contexto da carteira
│   └── ...
├── pages/
│   ├── Home.js               # Tela principal do Capy Pay
│   ├── Dashboard.js          # Dashboard de usuário
│   ├── Payments.js           # Histórico de pagamentos
│   └── Staking.js            # Funcionalidades de staking
├── styles/
│   ├── theme.js              # Tema Material-UI customizado
│   └── App.css               # Estilos específicos do Capy Pay
└── ...
```

## 🎨 Classes CSS Personalizadas

```css
.capy-gradient-bg          # Fundo gradiente principal
.capy-primary-gradient     # Gradiente verde-turquesa
.capy-secondary-gradient   # Gradiente marrom
.capy-card                 # Cards com bordas arredondadas
.capy-button-primary       # Botão principal marrom
.capy-button-secondary     # Botão secundário outlined
.capy-balance-card         # Card do saldo principal
.capy-icon-button          # Botões de ícone com hover
.capy-transaction-item     # Itens de transação
.capy-floating-animation   # Animação flutuante
.capy-fade-in             # Animação de entrada
```

## 🔧 Personalização

Para personalizar o tema:

1. Edite `src/styles/theme.js` para alterar cores principais
2. Modifique `src/styles/App.css` para ajustar estilos específicos
3. Atualize componentes em `src/pages/Home.js` para mudanças estruturais

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Capy Pay** - Seu dinheiro, sua tranquilidade 🦫💰
