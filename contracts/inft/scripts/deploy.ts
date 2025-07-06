const { ethers: hardhatEthers } = require("hardhat");

async function deployINFT() {
    const [deployer] = await hardhatEthers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const MockOracle = await hardhatEthers.getContractFactory("MockOracle");
    const oracle = await MockOracle.deploy();
    await oracle.waitForDeployment();
    
    const INFT = await hardhatEthers.getContractFactory("INFT");
    const inft = await INFT.deploy(
        "AI Agent NFTs",
        "AINFT",
        await oracle.getAddress()
    );
    await inft.waitForDeployment();
    
    console.log("Oracle deployed to:", await oracle.getAddress());
    console.log("INFT deployed to:", await inft.getAddress());
}

deployINFT().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});