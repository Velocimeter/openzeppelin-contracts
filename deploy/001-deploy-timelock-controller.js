const minDelay = 86400; // 24 hours in seconds
const proposers = [
  '0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51',
  '0x3c5Aac016EF2F178e8699D6208796A2D67557fe2',
  '0x0b776552c1Aef1Dc33005DD25AcDA22493b6615d',
  '0x53f3B51FD7F327E1Ec4E6eAa3A049149cB2acaD2',
  '0x78e801136F77805239A7F533521A7a5570F572C8',
];
const executors = ['0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51'];
const admin = '0x13eeB8EdfF60BbCcB24Ec7Dd5668aa246525Dc51';

const func = async function (hre) {
  const { deployments } = hre;
  const { deploy } = deployments;

  await deploy('TimelockController', {
    from: process.env.CANTO_PRIVATE_KEY,
    args: [minDelay, proposers, executors, admin],
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

func.tags = ['TimelockController'];
func.id = 'TimelockController';

module.exports = func;
