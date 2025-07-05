const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Deploy mock oracle for testing (replace with real oracle in production)
    const MockOracle = await ethers.getContractFactory("MockOracle");
    const oracle = await MockOracle.deploy();
    await oracle.waitForDeployment();
    
    // Deploy INFT contract
    const INFT = await ethers.getContractFactory("INFT");
    const inft = await INFT.deploy(
        "AI Agent NFTs",
        "AINFT",
        await oracle.getAddress()
    );
    await inft.waitForDeployment();
    
    console.log("Oracle deployed to:", await oracle.getAddress());
    console.log("INFT deployed to:", await inft.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});