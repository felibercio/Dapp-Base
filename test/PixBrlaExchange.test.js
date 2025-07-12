const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PixBrlaExchange", function () {
  let brlaToken, pixOracle, pixBrlaExchange;
  let owner, treasury, feeCollector, user1, user2;

  beforeEach(async function () {
    [owner, treasury, feeCollector, user1, user2] = await ethers.getSigners();

    // Deploy BRLA Token
    const BRLAToken = await ethers.getContractFactory("BRLAToken");
    brlaToken = await BRLAToken.deploy("Brazilian Real Lastreado", "BRLA", owner.address);
    await brlaToken.waitForDeployment();

    // Deploy PIX Oracle
    const PixOracle = await ethers.getContractFactory("PixOracle");
    pixOracle = await PixOracle.deploy(owner.address);
    await pixOracle.waitForDeployment();

    // Deploy PIX BRLA Exchange
    const PixBrlaExchange = await ethers.getContractFactory("PixBrlaExchange");
    pixBrlaExchange = await PixBrlaExchange.deploy(
      await brlaToken.getAddress(),
      await pixOracle.getAddress(),
      treasury.address,
      feeCollector.address,
      owner.address
    );
    await pixBrlaExchange.waitForDeployment();

    // Setup permissions
    await brlaToken.addMinter(await pixBrlaExchange.getAddress());
    await brlaToken.addBurner(await pixBrlaExchange.getAddress());
    await pixOracle.addReporter(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pixBrlaExchange.owner()).to.equal(owner.address);
    });

    it("Should set the right token address", async function () {
      expect(await pixBrlaExchange.brlaToken()).to.equal(await brlaToken.getAddress());
    });

    it("Should set the right oracle address", async function () {
      expect(await pixBrlaExchange.pixOracle()).to.equal(await pixOracle.getAddress());
    });
  });

  describe("PIX to BRLA Conversion", function () {
    it("Should initiate PIX to BRLA conversion", async function () {
      const pixId = "PIX123456";
      const amount = ethers.parseEther("100");

      await expect(
        pixBrlaExchange.connect(user1).initiatePixToBrla(pixId, amount)
      ).to.emit(pixBrlaExchange, "PixToBrlaInitiated");
    });

    it("Should complete PIX to BRLA conversion", async function () {
      const pixId = "PIX123456";
      const amount = ethers.parseEther("100");

      // Initiate conversion
      await pixBrlaExchange.connect(user1).initiatePixToBrla(pixId, amount);

      // Report payment to oracle
      await pixOracle.reportPixPayment(
        pixId,
        amount,
        user1.address,
        "user1@example.com",
        "BANK123456"
      );

      // Confirm payment
      await pixOracle.confirmPixPayment(pixId);

      // Complete conversion
      await expect(
        pixBrlaExchange.completePixToBrla(pixId)
      ).to.emit(pixBrlaExchange, "PixToBrlaCompleted");

      // Check BRLA balance
      const balance = await brlaToken.balanceOf(user1.address);
      expect(balance).to.be.gt(0);
    });
  });

  describe("BRLA to PIX Conversion", function () {
    it("Should initiate BRLA to PIX conversion", async function () {
      // First mint some BRLA to user
      const brlaAmount = ethers.parseEther("100");
      await brlaToken.mint(user1.address, brlaAmount);

      // Approve exchange to burn tokens
      await brlaToken.connect(user1).approve(await pixBrlaExchange.getAddress(), brlaAmount);

      await expect(
        pixBrlaExchange.connect(user1).initiateBrlaToPixConversion(
          brlaAmount,
          "user1@example.com"
        )
      ).to.emit(pixBrlaExchange, "BrlaToPixInitiated");
    });
  });

  describe("Configuration", function () {
    it("Should update configuration", async function () {
      await pixBrlaExchange.updateConfiguration(
        100, // 1% fee
        ethers.parseEther("10"), // min amount
        ethers.parseEther("5000"), // max amount
        ethers.parseEther("25000") // daily limit
      );

      expect(await pixBrlaExchange.feePercentage()).to.equal(100);
    });
  });
}); 