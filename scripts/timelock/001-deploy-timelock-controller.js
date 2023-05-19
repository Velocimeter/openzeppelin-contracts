const hre = require("hardhat");

async function main() {
  const minDelay = 86400; // 24 hours in seconds
  const proposers = [
    "0x8041316BfCCec44534F627F03B8c5D03901BcA2B",
    "0x13cB009A280bd617ec1C9dB97A2584A90F0b23F3",
    "0xF7a94CCB3048Bdc95f8041D0a2D7bf939479f99d",
    "0x48DBe7dD2Aa7dbb0d3FbF3677f0B68b2C283DeAF",
    "0xA42E8966423afAC3F676715d1928CB758aEeCa02"
  ];
  const executors = [
    "0x995F09D33AB1DbC68F6AB1f775E518b5fE842fB5"
  ];
  const admin = "0x995F09D33AB1DbC68F6AB1f775E518b5fE842fB5";

  const TimelockController = await hre.ethers.getContractFactory("TimelockController");

  console.log("Deploying TimelockController ...");
  const timelockController = await TimelockController.deploy(minDelay, proposers, executors, admin);
  console.log(timelockController);
  await timelockController.deployed();

  console.log(`TimelockController deployed to ${timelockController.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});











