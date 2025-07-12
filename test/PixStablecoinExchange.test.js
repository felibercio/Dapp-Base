const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PixStablecoinExchange", function () {
  let pixStablecoinExchange;
  let mockBRLA, mockUSDC;
  let owner, treasury, feeCollector, user1, user2;

  beforeEach(async function () {
    [owner, treasury, feeCollector, user1, user2] = await ethers.getSigners();

    // Deploy mock BRLA token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockBRLA = await MockToken.deploy("Brazilian Real Lastreado", "BRLA", 18);
    await mockBRLA.waitForDeployment();

    // Deploy mock USDC token
    mockUSDC = await MockToken.deploy("USD Coin", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy PixStablecoinExchange
    const PixStablecoinExchange = await ethers.getContractFactory("PixStablecoinExchange");
    pixStablecoinExchange = await PixStablecoinExchange.deploy(
      treasury.address,
      feeCollector.address,
      owner.address
    );
    await pixStablecoinExchange.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pixStablecoinExchange.owner()).to.equal(owner.address);
    });

    it("Should set the right treasury and fee collector", async function () {
      expect(await pixStablecoinExchange.treasury()).to.equal(treasury.address);
      expect(await pixStablecoinExchange.feeCollector()).to.equal(feeCollector.address);
    });

    it("Should have correct initial fee percentage", async function () {
      expect(await pixStablecoinExchange.feePercentage()).to.equal(50); // 0.5%
    });
  });

  describe("Stablecoin Management", function () {
    it("Should add BRLA stablecoin", async function () {
      await pixStablecoinExchange.addStablecoin(
        await mockBRLA.getAddress(),
        18,
        ethers.parseEther("1"),
        ethers.parseEther("10000"),
        ethers.parseEther("50000"),
        ethers.parseEther("1")
      );

      const stablecoinInfo = await pixStablecoinExchange.getStablecoinInfo(await mockBRLA.getAddress());
      expect(stablecoinInfo.isActive).to.be.true;
      expect(stablecoinInfo.decimals).to.equal(18);
    });

    it("Should add USDC stablecoin", async function () {
      await pixStablecoinExchange.addStablecoin(
        await mockUSDC.getAddress(),
        6,
        ethers.parseEther("1"),
        ethers.parseEther("10000"),
        ethers.parseEther("50000"),
        ethers.parseEther("5.5")
      );

      const stablecoinInfo = await pixStablecoinExchange.getStablecoinInfo(await mockUSDC.getAddress());
      expect(stablecoinInfo.isActive).to.be.true;
      expect(stablecoinInfo.decimals).to.equal(6);
    });
  });

  describe("PIX to Stablecoin Conversion", function () {
    beforeEach(async function () {
      // Add BRLA stablecoin
      await pixStablecoinExchange.addStablecoin(
        await mockBRLA.getAddress(),
        18,
        ethers.parseEther("1"),
        ethers.parseEther("10000"),
        ethers.parseEther("50000"),
        ethers.parseEther("1")
      );

      // Fund the pool
      await mockBRLA.mint(owner.address, ethers.parseEther("100000"));
      await mockBRLA.approve(await pixStablecoinExchange.getAddress(), ethers.parseEther("100000"));
      await pixStablecoinExchange.fundPool(await mockBRLA.getAddress(), ethers.parseEther("100000"));
    });

    it("Should initiate PIX to stablecoin conversion", async function () {
      const pixId = "PIX123456";
      const amount = ethers.parseEther("100");

      await expect(
        pixStablecoinExchange.connect(user1).initiatePixToStablecoin(pixId, amount, await mockBRLA.getAddress())
      ).to.emit(pixStablecoinExchange, "PixToStablecoinInitiated");
    });

    it("Should fail with invalid PIX ID", async function () {
      const amount = ethers.parseEther("100");

      await expect(
        pixStablecoinExchange.connect(user1).initiatePixToStablecoin("", amount, await mockBRLA.getAddress())
      ).to.be.revertedWith("PIX ID cannot be empty");
    });

    it("Should fail with amount below minimum", async function () {
      const pixId = "PIX123456";
      const amount = ethers.parseEther("0.5");

      await expect(
        pixStablecoinExchange.connect(user1).initiatePixToStablecoin(pixId, amount, await mockBRLA.getAddress())
      ).to.be.revertedWith("Amount below minimum");
    });
  });

  describe("Fee Calculations", function () {
    it("Should calculate fee correctly", async function () {
      const amount = ethers.parseEther("1000");
      const expectedFee = ethers.parseEther("5"); // 0.5% of 1000

      const calculatedFee = await pixStablecoinExchange.calculateFee(amount);
      expect(calculatedFee).to.equal(expectedFee);
    });
  });

  describe("Administrative Functions", function () {
    it("Should update fee percentage", async function () {
      const newFeePercentage = 100; // 1%

      await pixStablecoinExchange.updateFeePercentage(newFeePercentage);
      expect(await pixStablecoinExchange.feePercentage()).to.equal(newFeePercentage);
    });

    it("Should pause and unpause", async function () {
      await pixStablecoinExchange.pause();
      expect(await pixStablecoinExchange.paused()).to.be.true;

      await pixStablecoinExchange.unpause();
      expect(await pixStablecoinExchange.paused()).to.be.false;
    });
  });
}); 