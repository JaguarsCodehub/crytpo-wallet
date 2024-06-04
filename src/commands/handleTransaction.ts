// transactionHandler.ts

import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import loadWallet from './loadWallet';

const handleTransaction = async (
  tx: ethers.TransactionResponse,
  walletAddress: string
): Promise<void> => {
  const transactionData = {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    timestamp: Date.now(),
  };

  const wallet = await loadWallet();
  if (!wallet) {
    console.error('Failed to load wallet.');
    return;
  }

  // Append transaction data to the JSON file
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

    loadedTransactionFile.push(transactionData);

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

    console.log(`Transactions Loaded: `, loadedTransactionFile);
  } catch (error: any) {
    console.error('Error writing transaction data to file:', error.message);
  }
};

export default handleTransaction;
