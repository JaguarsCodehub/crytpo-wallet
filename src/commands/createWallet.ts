import Wallet from 'ethereumjs-wallet';
import fs from 'fs';
import path from 'path';
import { password } from '@inquirer/prompts';
import crypto from 'crypto';

const saveWallet = (wallet: Wallet, password: string): void => {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  const encryptedPrivateKey = Buffer.concat([
    cipher.update(wallet.getPrivateKey().toString('hex'), 'utf8'),
    cipher.final(),
  ]);

  const walletFile = path.join(__dirname, '..', 'wallet.json');
  fs.writeFileSync(
    walletFile,
    JSON.stringify({
      address: wallet.getAddressString(),
      privateKey: encryptedPrivateKey.toString('hex'),
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
    })
  );
  console.log('Wallet saved to wallet.json');
};

const createWallet = async (): Promise<void> => {
  const passwordInput = await password({
    message: 'Enter a password to encrypt your wallet:',
    mask: '*',
  });

  const wallet = Wallet.generate();
  saveWallet(wallet, passwordInput);
};

export default createWallet;
