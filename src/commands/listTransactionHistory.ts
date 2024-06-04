// listTransactionHistory.ts

import fs from 'fs';
import path from 'path';
import Wallet from 'ethereumjs-wallet';
import loadWallet from './loadWallet';
import { input } from '@inquirer/prompts';

const TRANSACTION_DB_FILE = path.join(__dirname, '..', 'transactions.json');

const listTransactionHistory = async (): Promise<void> => {
  const wallet = await loadWallet();
  if (!wallet) {
    console.error('Failed to load wallet.');
    return;
  }
  const rpcUrl = await input({
    message: 'Enter the RPC URL of the Ethereum node:',
  });
  try {
    const transactionFile = path.join(__dirname, '..', 'transactions.json');

    let loadedTransactionFile: any[] = [];
    if (fs.existsSync(transactionFile)) {
      const fileContents = fs.readFileSync(transactionFile, 'utf-8');
      loadedTransactionFile = JSON.parse(fileContents);
    }

    // Ensure loadedTransactionFile is an array
    if (!Array.isArray(loadedTransactionFile)) {
      loadedTransactionFile = [];
    }

    fs.writeFileSync(
      transactionFile,
      JSON.stringify(loadedTransactionFile, null, 2)
    );

    console.log('Transaction History:');
    loadedTransactionFile.forEach((tx: any) => {
      if (
        tx.from === wallet.getAddressString() ||
        tx.to === wallet.getAddressString()
      ) {
        const status = tx.blockNumber ? 'confirmed' : 'pending'; // Check if transaction is confirmed or pending
        console.log(`Transaction Hash: ${tx.hash}`);
        console.log(`Sender Address: ${tx.from}`);
        console.log(`Recipient Address: ${tx.to}`);
        console.log(`Amount Sent: ${tx.value} Wei`);
        console.log(`Status: ${status}`);
        console.log('-----------------------------');
      } else {
        console.log('Error in fetching all transactions');
      }
    });
  } catch (error: any) {
    console.error('Error writing transaction data to file:', error.message);
  }
};

export default listTransactionHistory;
