
async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Endereços das stablecoins na Base (mainnet)
  const BRLA_ADDRESS = "0x5d0707b7e9b3b75d5a9e0e2e0e0e0e0e0e0e0e0e"; // Substituir pelo endereço real
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC na Base

  // 1. Deploy PixStablecoinExchange
  console.log("\n1. Deploying PixStablecoinExchange...");
  const PixStablecoinExchange = await ethers.getContractFactory("PixStablecoinExchange");
  const pixStablecoinExchange = await PixStablecoinExchange.deploy(
    deployer.address, // treasury
    deployer.address, // feeCollector
    deployer.address  // initialOwner
  );
  await pixStablecoinExchange.deployed();
  console.log("PixStablecoinExchange deployed to:", pixStablecoinExchange.address);

  // 2. Configurar BRLA
  console.log("\n2. Adding BRLA stablecoin...");
  await pixStablecoinExchange.addStablecoin(
    BRLA_ADDRESS,
    18, // decimals
    ethers.parseEther("1"), // minAmount: 1 BRL
    ethers.parseEther("10000"), // maxAmount: 10,000 BRL
    ethers.parseEther("50000"), // dailyLimit: 50,000 BRL
    ethers.parseEther("1") // exchangeRate: 1:1
  );
  console.log("BRLA stablecoin added");

  // 3. Configurar USDC
  console.log("\n3. Adding USDC stablecoin...");
  await pixStablecoinExchange.addStablecoin(
    USDC_ADDRESS,
    6, // decimals
    ethers.parseEther("1"), // minAmount: 1 BRL
    ethers.parseEther("10000"), // maxAmount: 10,000 BRL
    ethers.parseEther("50000"), // dailyLimit: 50,000 BRL
    ethers.parseEther("5.5") // exchangeRate: 1 BRL = 0.18 USDC (aproximadamente)
  );
  console.log("USDC stablecoin added");

  // 4. Salvar endereços
  console.log("\n4. Contract addresses:");
  console.log("======================");
  console.log("PixStablecoinExchange:", pixStablecoinExchange.address);
  console.log("BRLA Token:", BRLA_ADDRESS);
  console.log("USDC Token:", USDC_ADDRESS);
  console.log("======================");

  // 5. Salvar em arquivo de configuração
  const fs = require('fs');
  const contractAddresses = {
    PIX_STABLECOIN_EXCHANGE: pixStablecoinExchange.address,
    BRLA_TOKEN: BRLA_ADDRESS,
    USDC_TOKEN: USDC_ADDRESS,
    NETWORK: network.name,
    DEPLOYER: deployer.address,
    DEPLOYMENT_BLOCK: await ethers.provider.getBlockNumber()
  };

  fs.writeFileSync(
    'contract-addresses.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 