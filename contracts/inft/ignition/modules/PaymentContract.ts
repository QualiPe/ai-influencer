import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PaymentContract", (m) => {
  const paymentContract = m.contract("PaymentContract", []);

  return { paymentContract };
}); 