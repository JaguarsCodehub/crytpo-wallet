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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const crypto_1 = __importDefault(require("crypto"));
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
const loadWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const walletFile = path_1.default.join(__dirname, '..', 'wallet.json');
    if (!fs_1.default.existsSync(walletFile)) {
        console.log('No wallet found. Please create a wallet first.');
        return null;
    }
    const questions = [
        {
            type: 'password',
            name: 'password',
            message: 'Enter your wallet password:',
            mask: '*',
        },
    ];
    const answers = yield inquirer_1.default.prompt(questions);
    const walletData = JSON.parse(fs_1.default.readFileSync(walletFile, 'utf8'));
    const decryptedPrivateKey = crypto_1.default
        .createDecipher('aes-256-ctr', answers.password)
        .update(walletData.privateKey, 'hex', 'utf8');
    const wallet = ethereumjs_wallet_1.default.fromPrivateKey(Buffer.from(decryptedPrivateKey, 'hex'));
    console.log(`Wallet loaded. Address: ${wallet.getAddressString()}`);
    return wallet;
});
exports.default = loadWallet;
