# Super Dapp Base

Uma aplicação descentralizada (DApp) para pagamentos PIX e conversões para BRLA na rede Base.

## 🚀 Funcionalidades

- **Pagamentos PIX**: Realize pagamentos PIX de forma rápida e segura
- **Conversão PIX ↔ BRLA**: Converta entre PIX brasileiro e BRLA (stablecoin na Base)
- **Staking**: Faça staking de tokens BRLA e ganhe recompensas
- **Dashboard**: Gerencie suas transações e visualize histórico
- **Integração Web3**: Conecte sua wallet MetaMask para interagir com a blockchain

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Material-UI
- **Blockchain**: Base (Layer 2), Ethereum
- **Web3**: Wagmi, Viem, Ethers.js
- **Wallet**: RainbowKit, MetaMask
- **Styling**: Material-UI Theme, CSS

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- MetaMask instalado no navegador

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/super-dapp-base.git
   cd super-dapp-base
   ```

2. **Instale as dependências**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   REACT_APP_WALLET_CONNECT_PROJECT_ID=seu-project-id
   REACT_APP_PIX_API_TOKEN=seu-token-pix
   REACT_APP_BRLA_CONTRACT_ADDRESS=endereço-do-contrato
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração da Wallet

1. **Instale o MetaMask** se ainda não tiver
2. **Configure a rede Base**:
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency Symbol: ETH
   - Block Explorer: https://basescan.org

3. **Conecte sua wallet** clicando no botão "Connect Wallet"

## 📱 Como Usar

### Pagamentos PIX

1. Acesse a página "Pagamentos"
2. Escolha o valor e insira a chave PIX
3. Confirme a transação
4. Aguarde a confirmação

### Conversão PIX → BRLA

1. Vá para o Dashboard
2. Selecione "PIX Interface"
3. Insira o valor em PIX
4. Confirme a conversão
5. Receba BRLA em sua wallet

### Staking

1. Acesse a página "Staking"
2. Escolha um pool de staking
3. Defina o valor para stake
4. Confirme a transação
5. Ganhe recompensas passivas

## 🔒 Segurança

- **Nunca compartilhe** sua seed phrase ou chaves privadas
- **Verifique sempre** os endereços de contrato
- **Use apenas** redes oficiais
- **Mantenha** sua wallet atualizada

## 🐛 Problemas Conhecidos

- Conflitos de dependências do wagmi/react-query (usar `--legacy-peer-deps`)
- Algumas funcionalidades estão em desenvolvimento
- Necessário configurar endereços de contrato reais

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o ecossistema Base**
