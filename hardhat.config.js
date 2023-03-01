/// ENVVAR
// - CI:                output gas report to file instead of stdout
// - COVERAGE:          enable coverage report
// - ENABLE_GAS_REPORT: enable gas report
// - COMPILE_MODE:      production modes enables optimizations (default: development)
// - COMPILE_VERSION:   compiler version (default: 0.8.9)
// - COINMARKETCAP:     coinmarkercat api key for USD value in gas report

// require('node_modules/@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')
const fs = require('fs')
const path = require('path')
const argv = require('yargs/yargs')()
  .env('')
  .options({
    coverage: {
      type: 'boolean',
      default: false,
    },
    gas: {
      alias: 'enableGasReport',
      type: 'boolean',
      default: false,
    },
    gasReport: {
      alias: 'enableGasReportPath',
      type: 'string',
      implies: 'gas',
      default: undefined,
    },
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: ['production', 'development'],
      default: 'development',
    },
    ir: {
      alias: 'enableIR',
      type: 'boolean',
      default: false,
    },
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.13',
    },
    coinmarketcap: {
      alias: 'coinmarketcapApiKey',
      type: 'string',
    },
  }).argv

require('@nomiclabs/hardhat-truffle5')
require('@nomiclabs/hardhat-ethers')
require('hardhat-ignore-warnings')
require('hardhat-exposed')
require('@nomiclabs/hardhat-etherscan')

require('solidity-docgen')
require('dotenv').config()
const { DEPLOYER_KEY } = process.env

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f))
}

const withOptimizations = argv.gas || argv.compileMode === 'production'

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: argv.compiler,
    settings: {
      optimizer: {
        enabled: withOptimizations,
        runs: 200,
      },
      viaIR: withOptimizations && argv.ir,
      outputSelection: { '*': { '*': ['storageLayout'] } },
    },
  },
  warnings: {
    '*': {
      'code-size': withOptimizations,
      'unused-param': !argv.coverage, // coverage causes unused-param warnings
      default: 'error',
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: !withOptimizations,
    },
    goerli: {
      chainId: 5,
      url: process.env.ALCHEMY_GOERLI_URL,
      gasPrice: 1000000000,
      accounts: [DEPLOYER_KEY],
    },
    canto: {
      url: process.env.CANTO_RPC_URL,
      accounts: [process.env.CANTO_PRIVATE_KEY],
      chainId: 7700,
      saveDeployments: true,
      verify: {
        etherscan: {
          apiUrl: 'https://evm.explorer.canto.io',
          apiKey: {
            canto: '',
          },
        },
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      canto: '?',
    },
    customChains: [
      {
        network: 'canto',
        chainId: 7700,
        urls: {
          apiURL: 'https://tuber.build',
          browserURL: '',
        },
        etherscan: {
          apiKey: {
            canto: '',
          },
        },
      },
    ],
  },

  exposed: {
    exclude: [
      'vendor/**/*',
      // overflow clash
      'utils/Timers.sol',
    ],
  },
  docgen: require('./docs/config'),
}

if (argv.gas) {
  require('hardhat-gas-reporter')
  module.exports.gasReporter = {
    showMethodSig: true,
    currency: 'USD',
    outputFile: argv.gasReport,
    coinmarketcap: argv.coinmarketcap,
  }
}

if (argv.coverage) {
  require('solidity-coverage')
  module.exports.networks.hardhat.initialBaseFeePerGas = 0
}
