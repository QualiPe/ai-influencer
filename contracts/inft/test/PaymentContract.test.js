const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentContract", function () {
  let paymentContract;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const PaymentContractFactory = await ethers.getContractFactory("PaymentContract");
    paymentContract = await PaymentContractFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await paymentContract.owner()).to.equal(owner.address);
    });

    it("Should have correct initial values", async function () {
      expect(await paymentContract.serviceFee()).to.equal(250); // 2.5%
      expect(await paymentContract.minPaymentAmount()).to.equal(ethers.parseEther("0.001"));
      expect(await paymentContract.maxPaymentAmount()).to.equal(ethers.parseEther("10"));
    });
  });

  describe("sendPayment", function () {
    it("Should accept payment with message", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "Test payment message";
      
      const tx = await paymentContract.connect(user1).sendPayment(message, { value: amount });
      const receipt = await tx.wait();
      
      // Check event
      const event = receipt.logs.find((log) => 
        log.fragment && log.fragment.name === "PaymentReceived"
      );
      expect(event).to.not.be.undefined;
      
      // Check payment data
      const payment = await paymentContract.getPayment(1);
      expect(payment.from).to.equal(user1.address);
      expect(payment.to).to.equal(owner.address);
      expect(payment.amount).to.equal(amount - (amount * 250n) / 10000n); // After fee
      expect(payment.message).to.equal(message);
      expect(payment.exists).to.be.true;
    });

    it("Should reject payment below minimum", async function () {
      const amount = ethers.parseEther("0.0005"); // Below 0.001
      const message = "Test message";
      
      await expect(
        paymentContract.connect(user1).sendPayment(message, { value: amount })
      ).to.be.revertedWith("Amount too low");
    });

    it("Should reject payment above maximum", async function () {
      const amount = ethers.parseEther("15"); // Above 10
      const message = "Test message";
      
      await expect(
        paymentContract.connect(user1).sendPayment(message, { value: amount })
      ).to.be.revertedWith("Amount too high");
    });

    it("Should reject empty message", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "";
      
      await expect(
        paymentContract.connect(user1).sendPayment(message, { value: amount })
      ).to.be.revertedWith("Message cannot be empty");
    });

    it("Should reject message too long", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "a".repeat(501); // 501 characters
      
      await expect(
        paymentContract.connect(user1).sendPayment(message, { value: amount })
      ).to.be.revertedWith("Message too long");
    });

    it("Should reject owner sending to self", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "Test message";
      
      await expect(
        paymentContract.connect(owner).sendPayment(message, { value: amount })
      ).to.be.revertedWith("Owner cannot send to self");
    });
  });

  describe("sendPaymentTo", function () {
    it("Should send payment to specific address", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "Test payment to specific address";
      
      const initialBalance = await ethers.provider.getBalance(user2.address);
      
      const tx = await paymentContract.connect(user1).sendPaymentTo(user2.address, message, { value: amount });
      const receipt = await tx.wait();
      
      // Check event
      const event = receipt.logs.find((log) => 
        log.fragment && log.fragment.name === "PaymentReceived"
      );
      expect(event).to.not.be.undefined;
      
      // Check recipient balance increased
      const finalBalance = await ethers.provider.getBalance(user2.address);
      const feeAmount = (amount * 250n) / 10000n;
      const netAmount = amount - feeAmount;
      expect(finalBalance - initialBalance).to.equal(netAmount);
      
      // Check payment data
      const payment = await paymentContract.getPayment(1);
      expect(payment.from).to.equal(user1.address);
      expect(payment.to).to.equal(user2.address);
      expect(payment.amount).to.equal(netAmount);
      expect(payment.message).to.equal(message);
    });

    it("Should reject sending to zero address", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "Test message";
      
      await expect(
        paymentContract.connect(user1).sendPaymentTo(ethers.ZeroAddress, message, { value: amount })
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should reject sending to self", async function () {
      const amount = ethers.parseEther("0.1");
      const message = "Test message";
      
      await expect(
        paymentContract.connect(user1).sendPaymentTo(user1.address, message, { value: amount })
      ).to.be.revertedWith("Cannot send to self");
    });
  });

  describe("Fee Management", function () {
    it("Should calculate fees correctly", async function () {
      const amount = ethers.parseEther("1");
      const message = "Test fee calculation";
      
      await paymentContract.connect(user1).sendPayment(message, { value: amount });
      
      const payment = await paymentContract.getPayment(1);
      const expectedFee = (amount * 250n) / 10000n; // 2.5%
      const expectedNetAmount = amount - expectedFee;
      
      expect(payment.amount).to.equal(expectedNetAmount);
    });

    it("Should allow owner to update service fee", async function () {
      const newFee = 300; // 3%
      
      const tx = await paymentContract.connect(owner).updateServiceFee(newFee);
      const receipt = await tx.wait();
      
      // Check event
      const event = receipt.logs.find((log) => 
        log.fragment && log.fragment.name === "ServiceFeeUpdated"
      );
      expect(event).to.not.be.undefined;
      
      expect(await paymentContract.serviceFee()).to.equal(newFee);
    });

    it("Should reject non-owner updating fee", async function () {
      const newFee = 300;
      
      await expect(
        paymentContract.connect(user1).updateServiceFee(newFee)
      ).to.be.revertedWithCustomError(paymentContract, "OwnableUnauthorizedAccount");
    });

    it("Should reject fee above 10%", async function () {
      const newFee = 1100; // 11%
      
      await expect(
        paymentContract.connect(owner).updateServiceFee(newFee)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });
  });

  describe("Payment Limits", function () {
    it("Should allow owner to update payment limits", async function () {
      const newMin = ethers.parseEther("0.01");
      const newMax = ethers.parseEther("5");
      
      await paymentContract.connect(owner).updatePaymentLimits(newMin, newMax);
      
      expect(await paymentContract.minPaymentAmount()).to.equal(newMin);
      expect(await paymentContract.maxPaymentAmount()).to.equal(newMax);
    });

    it("Should reject non-owner updating limits", async function () {
      const newMin = ethers.parseEther("0.01");
      const newMax = ethers.parseEther("5");
      
      await expect(
        paymentContract.connect(user1).updatePaymentLimits(newMin, newMax)
      ).to.be.revertedWithCustomError(paymentContract, "OwnableUnauthorizedAccount");
    });

    it("Should reject min >= max", async function () {
      const newMin = ethers.parseEther("5");
      const newMax = ethers.parseEther("1");
      
      await expect(
        paymentContract.connect(owner).updatePaymentLimits(newMin, newMax)
      ).to.be.revertedWith("Min must be less than max");
    });

    it("Should reject max above 100 ETH", async function () {
      const newMin = ethers.parseEther("1");
      const newMax = ethers.parseEther("101");
      
      await expect(
        paymentContract.connect(owner).updatePaymentLimits(newMin, newMax)
      ).to.be.revertedWith("Max cannot exceed 100 ETH");
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      // Make some payments
      await paymentContract.connect(user1).sendPayment("Message 1", { value: ethers.parseEther("0.1") });
      await paymentContract.connect(user2).sendPayment("Message 2", { value: ethers.parseEther("0.2") });
      await paymentContract.connect(user1).sendPayment("Message 3", { value: ethers.parseEther("0.3") });
    });

    it("Should get payment by ID", async function () {
      const payment = await paymentContract.getPayment(1);
      expect(payment.from).to.equal(user1.address);
      expect(payment.message).to.equal("Message 1");
      expect(payment.exists).to.be.true;
    });

    it("Should reject getting non-existent payment", async function () {
      await expect(
        paymentContract.getPayment(999)
      ).to.be.revertedWith("Payment does not exist");
    });

    it("Should get user payments", async function () {
      const user1Payments = await paymentContract.getUserPayments(user1.address);
      expect(user1Payments).to.have.length(2);
      expect(user1Payments[0]).to.equal(1n);
      expect(user1Payments[1]).to.equal(3n);
    });

    it("Should get total received", async function () {
      const totalReceived = await paymentContract.getTotalReceived(owner.address);
      expect(totalReceived).to.be.gt(0);
    });

    it("Should get contract stats", async function () {
      const stats = await paymentContract.getContractStats();
      expect(stats.totalPayments).to.equal(3);
      expect(stats.currentBalance).to.be.gt(0);
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Make some payments to accumulate fees
      await paymentContract.connect(user1).sendPayment("Message 1", { value: ethers.parseEther("0.1") });
      await paymentContract.connect(user2).sendPayment("Message 2", { value: ethers.parseEther("0.2") });
    });

    it("Should allow owner to withdraw fees", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      const tx = await paymentContract.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      
      // Check event
      const event = receipt.logs.find((log) => 
        log.fragment && log.fragment.name === "PaymentWithdrawn"
      );
      expect(event).to.not.be.undefined;
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject non-owner withdrawal", async function () {
      await expect(
        paymentContract.connect(user1).withdrawFees()
      ).to.be.revertedWithCustomError(paymentContract, "OwnableUnauthorizedAccount");
    });

    it("Should reject withdrawal when no balance", async function () {
      // Withdraw all fees first
      await paymentContract.connect(owner).withdrawFees();
      
      // Try to withdraw again
      await expect(
        paymentContract.connect(owner).withdrawFees()
      ).to.be.revertedWith("No fees to withdraw");
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      // Make some payments
      await paymentContract.connect(user1).sendPayment("Message 1", { value: ethers.parseEther("0.1") });
    });

    it("Should allow owner to emergency withdraw", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await paymentContract.connect(owner).emergencyWithdraw();
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject non-owner emergency withdrawal", async function () {
      await expect(
        paymentContract.connect(user1).emergencyWithdraw()
      ).to.be.revertedWithCustomError(paymentContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Receive and Fallback", function () {
    it("Should reject direct ETH transfers", async function () {
      await expect(
        user1.sendTransaction({
          to: await paymentContract.getAddress(),
          value: ethers.parseEther("0.1")
        })
      ).to.be.revertedWith("Use sendPayment() function");
    });
  });
}); 