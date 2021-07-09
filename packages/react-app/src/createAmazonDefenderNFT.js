const { ethers, BigNumber } = require("ethers");
const amazonDefenderJSON = require("../../hardhat/artifacts/contracts/AmazonDefender.sol/AmazonDefender.json");

require("dotenv").config();

const tokenURI = "https://ipfs.io/ipfs/QmdZGphXqScF89z7kfsUia1beqhrknws3J7znZbVHJDiop?filename=AmazonDefender.json";
const amazonDefenderABI = amazonDefenderJSON.abi;

// If you don't specify a //url//, Ethers connects to the default
// (i.e. ``http:/\/localhost:8545``)
const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/100339d2a5ce47dd854e9c4e483cf2a3");

const amazonDefenderAddress = "0x70777a245f0Ac7A484241a4cFA48B46166a36817";

/// First wallet ////
const walletMnemonic = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC1);
const walletPrivateKey = new ethers.Wallet(walletMnemonic.privateKey);
const wallet = new ethers.Wallet(walletPrivateKey, provider);

/// Second wallet ////
// const walletMnemonic2 = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC2);
// const walletPrivateKey2 = new ethers.Wallet(walletMnemonic2.privateKey);
// const wallet2 = new ethers.Wallet(walletPrivateKey2, provider);

/// mint new NFT

const amazonDefenderContractA = new ethers.Contract(amazonDefenderAddress, amazonDefenderABI, wallet);
const sendPromiseA = amazonDefenderContractA.createCollectible(tokenURI);

sendPromiseA.then(transaction => {
  console.log(transaction);
});
