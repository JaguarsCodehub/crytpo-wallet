// viewWalletBalance.ts

import { ethers } from 'ethers';
import Wallet from 'ethereumjs-wallet';
import { input } from '@inquirer/prompts';
import loadWallet from './loadWallet';

const viewWalletBalance = async (): Promise<void> => {
  const wallet = await loadWallet();
  if (!wallet) {
    console.error('Failed to load wallet.');
    return;
  }
  const rpcUrl = await input({
    message: 'Enter the RPC URL of the Ethereum node:',
  });
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(wallet.getAddressString());
  const etherBalance = ethers.formatEther(balance);
  console.log(`Wallet Balance: ${etherBalance} ETH`);
};

export default viewWalletBalance;
