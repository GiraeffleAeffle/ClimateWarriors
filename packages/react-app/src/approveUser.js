const { ethers, BigNumber } = require("ethers");
require('dotenv').config()
// If you don't specify a //url//, Ethers connects to the default 
// (i.e. ``http:/\/localhost:8545``)
const provider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/100339d2a5ce47dd854e9c4e483cf2a3");

// The provider also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
// const signer = provider.getSigner();

// You can also use an ENS name for the contract address
const usdcAddress = "0xe22da380ee6B445bb8273C81944ADEB6E8450422";
const climateWarriorsAddress = "0x6955B59c0B3EF3Ad5cAF44298D740af3004dFF3b";
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const usdcAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const climateWarriorsAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_donated",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      }
    ],
    "name": "Funding",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_earned",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "account",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "deposited",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "earned",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "donated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkAccount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkCarbonCredits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "generosity",
        "type": "uint8"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawToBuyCarbonCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_interestRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_generosity",
        "type": "uint256"
      }
    ],
    "name": "withdrawalCalculator",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

/// First wallet ////
const walletMnemonic = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC1);
const walletPrivateKey = new ethers.Wallet(walletMnemonic.privateKey);
const wallet = new ethers.Wallet(walletPrivateKey, provider);

/// Second wallet ////
const walletMnemonic2 = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC2);
const walletPrivateKey2 = new ethers.Wallet(walletMnemonic2.privateKey);
const wallet2 = new ethers.Wallet(walletPrivateKey2, provider);
// constant
const MAX_UINT256 = ethers.constants.MaxUint256;

// approve USDC to Contract

// const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, wallet);
// const sendPromise11 = usdcContract.approve(climateWarriorsAddress, MAX_UINT256);

// sendPromise11.then(transaction => {
//   console.log(transaction);
// });

// const usdcContract2 = new ethers.Contract(usdcAddress, usdcAbi, wallet2);
// const sendPromise12 = usdcContract2.approve(climateWarriorsAddress, MAX_UINT256);

// sendPromise12.then(transaction => {
//   console.log(transaction);
// });

// Send USDC to Aave

// const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet);
// const sendPromise21 = climateWarriorsContract.deposit(5000000);

// sendPromise21.then(transaction => {
//   console.log(transaction);
// });

// const climateWarriorsContract2 = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet2);
// const sendPromise22 = climateWarriorsContract2.deposit(2000000000);

// sendPromise22.then(transaction => {
//   console.log(transaction);
// });

// aUSDC withdraw

// const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet);
// const sendPromise31 = climateWarriorsContract.withdraw(100);

// sendPromise31.then(transaction => {
//   console.log(transaction);
// });

// const climateWarriorsContract2 = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet2);
// const sendPromise32 = climateWarriorsContract2.withdraw(10);

// sendPromise32.then(transaction => {
//   console.log(transaction);
// });

/// withdrawal calculator

const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet);
const sendPromise41 = climateWarriorsContract.withdrawalCalculator(
  100000000,
  new ethers.BigNumber.from("1100000000000000000000000000"),
  100,
);

sendPromise41.then(transaction => {
  console.log(transaction);
  console.log("totalBalance: ", transaction[0].toNumber());
  console.log("onlyInterest: ", transaction[1].toNumber());
  console.log("donated: ", transaction[2].toNumber());
  console.log("earned: ", transaction[3].toNumber());
  console.log("withdrawalAmount: ", transaction[4].toNumber());
});

const climateWarriorsContract2 = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet2);
const sendPromise42 = climateWarriorsContract2.withdrawalCalculator(
  100000000,
  new ethers.BigNumber.from("1100000000000000000000000000"),
  50,
);

sendPromise42.then(transaction => {
  console.log(transaction);
  console.log("totalBalance: ", transaction[0].toNumber());
  console.log("onlyInterest: ", transaction[1].toNumber());
  console.log("donated: ", transaction[2].toNumber());
  console.log("earned: ", transaction[3].toNumber());
  console.log("withdrawalAmount: ", transaction[4].toNumber());
});

/// get account data

// const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet);
// const sendPromise41 = climateWarriorsContract.checkAccount();

// sendPromise41.then(transaction => {
//   console.log(transaction);
// });

// const climateWarriorsContract2 = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet2);
// const sendPromise42 = climateWarriorsContract2.checkAccount();

// sendPromise42.then(transaction => {
//   console.log(transaction);
// });

/// withdraw carbon credits

// const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, wallet);
// const sendPromise5 = climateWarriorsContract.withdrawToBuyCarbonCredits();

// sendPromise5.then(transaction => {
//   console.log(transaction);
// });

// Check contract aUSDC balance

// const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, wallet);
// const sendPromise11 = usdcContract.balanceOf(climateWarriorsAddress);

// sendPromise11.then(transaction => {
//   console.log(transaction);
// });
