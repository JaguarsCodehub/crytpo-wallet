import fs from 'fs';
import path from 'path';
import { password } from '@inquirer/prompts';
import crypto from 'crypto';
import Wallet from 'ethereumjs-wallet';

const loadWallet = async (): Promise<Wallet | null> => {
  const walletFile = path.join(__dirname, '..', 'wallet.json');
  if (!fs.existsSync(walletFile)) {
    console.log('No wallet found. Please create a wallet first.');
    return null;
  }

  const passwordInput = await password({
    message: 'Enter your wallet password:',
    mask: '*',
  });

  const walletData = JSON.parse(fs.readFileSync(walletFile, 'utf8'));
  const salt = Buffer.from(walletData.salt, 'hex');
  const iv = Buffer.from(walletData.iv, 'hex');
  const key = crypto.pbkdf2Sync(passwordInput, salt, 100000, 32, 'sha256');

  console.log('Salt:', walletData.salt);
  console.log('IV:', walletData.iv);
  console.log('Derived key:', key.toString('hex'));

  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const decryptedPrivateKey = Buffer.concat([
    decipher.update(Buffer.from(walletData.privateKey, 'hex')),
    decipher.final(),
  ]);
  console.log('Decrypted Private Key:', decryptedPrivateKey.toString('hex'));

  if (decryptedPrivateKey.length !== 32) {
    console.error('Decryption failed. Private key length is not 32 bytes.');
    return null;
  }

  const wallet = Wallet.fromPrivateKey(decryptedPrivateKey);
  console.log(`Wallet loaded. Address: ${wallet.getAddressString()}`);
  return wallet;
};

export default loadWallet;
