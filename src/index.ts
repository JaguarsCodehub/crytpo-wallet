import { Command } from 'commander';
import createWallet from './commands/createWallet';
import loadWallet from './commands/loadWallet';
import sendTransaction from './commands/sendTransaction';
import viewWalletBalance from './commands/viewBalance';
import listTransactionHistory from './commands/listTransactionHistory';

const program = new Command();

program
  .command('create-wallet')
  .description('Create a new wallet')
  .action(async () => {
    await createWallet();
  });

program
  .command('load-wallet')
  .description('Load an existing wallet')
  .action(async () => {
    await loadWallet();
  });

program
  .command('send-transaction')
  .description('Send a transaction')
  .action(async () => {
    await sendTransaction();
  });
program
  .command('view-balance')
  .description('View your Wallet Balance')
  .action(async () => {
    await viewWalletBalance();
  });
program
  .command('list-transaction')
  .description('List your transaction history')
  .action(async () => {
    await listTransactionHistory();
  });

program.parse(process.argv);
