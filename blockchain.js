require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://ethereum-holesky-rpc.publicnode.com');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendToBlockchain(data) {
  const jsonData = JSON.stringify(data);
  const tx = {
    to: process.env.TO_ADDRESS,
    value: 0,
    data: ethers.utils.hexlify(Buffer.from(jsonData, 'utf8')),
    gasLimit: 100000,
  };

  const transactionResponse = await wallet.sendTransaction(tx);
  const receipt = await transactionResponse.wait();

  return receipt.transactionHash;
}

module.exports = { sendToBlockchain };
