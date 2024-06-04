import { ethers } from 'ethers';
import { input } from '@inquirer/prompts';
import loadWallet from './loadWallet'; // Assuming you have a function to load the wallet from the previous implementation
import handleTransaction from './handleTransaction';

const sendTransaction = async (): Promise<void> => {
  // Load the wallet
  const wallet = await loadWallet();
  if (!wallet) {
    console.error('Failed to load wallet.');
    return;
  }

  // Prompt user for transaction details
  const recipientAddress = await input({
    message: 'Enter the recipient address:',
  });
  const ethAmount = await input({
    message: 'Enter the amount to send (in ETH):',
    validate: (input) => {
      if (isNaN(parseFloat(input))) {
        return 'Amount must be a valid number.';
      }
      return true;
    },
  });
  const rpcUrl = await input({
    message: 'Enter the RPC URL of the Ethereum node:',
  });

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(wallet.getPrivateKeyString(), provider);

  // Send transaction
  const tx = await signer.sendTransaction({
    to: recipientAddress,
    value: ethers.parseEther(ethAmount),
  });

  await handleTransaction(tx, wallet.getAddressString());

  console.log(`Transaction sent. Hash: ${tx.hash}`);
};

export default sendTransaction;
