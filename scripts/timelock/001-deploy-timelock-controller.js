const hre = require("hardhat");

async function main() {
  const minDelay = 86400; // 24 hours in seconds
  const proposers = [
    "0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51",
    "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2",
    "0x0b776552c1Aef1Dc33005DD25AcDA22493b6615d",
    "0x53f3B51FD7F327E1Ec4E6eAa3A049149cB2acaD2",
    "0x78e801136F77805239A7F533521A7a5570F572C8"
  ];
  const executors = [
    "0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51"
  ];
  const admin = "0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51";

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