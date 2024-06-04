"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer = require('inquirer');
const crypto_1 = __importDefault(require("crypto"));
const iv = crypto_1.default.randomBytes(16);
const saveWallet = (wallet, password) => {
    const encryptedPrivateKey = crypto_1.default
        .createCipheriv('aes-256-ctr', password, iv)
        .update(wallet.getPrivateKeyString(), 'utf8', 'hex');
    const walletFile = path_1.default.join(__dirname, '..', 'wallet.json');
    fs_1.default.writeFileSync(walletFile, JSON.stringify({
        address: wallet.getAddressString(),
        privateKey: encryptedPrivateKey,
    }));
    console.log('Wallet saved to wallet.json');
};
const createWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = ethereumjs_wallet_1.default.generate();
    const questions = [
        {
            type: 'password',
            name: 'password',
            message: 'Enter a password to encrypt your wallet:',
            mask: '*',
        },
    ];
    const answers = yield inquirer.prompt(questions);
    saveWallet(wallet, answers.password);
});
exports.default = createWallet;
