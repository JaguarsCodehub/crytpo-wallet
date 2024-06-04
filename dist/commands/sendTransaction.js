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
const ethers_1 = require("ethers");
const inquirer_1 = __importDefault(require("inquirer"));
const loadWallet_1 = __importDefault(require("./loadWallet"));
const sendTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, loadWallet_1.default)();
    if (!wallet) {
        return;
    }
    const questions = [
        {
            type: 'input',
            name: 'to',
            message: 'Enter the recipient address:',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter the amount to send (in ETH):',
        },
        {
            type: 'input',
            name: 'rpcUrl',
            message: 'Enter the RPC URL of the Ethereum node:',
        },
    ];
    const answers = yield inquirer_1.default.prompt(questions);
    const provider = new ethers_1.ethers.JsonRpcProvider(answers.rpcUrl);
    const signer = new ethers_1.ethers.Wallet(wallet.getPrivateKeyString(), provider);
    const tx = yield signer.sendTransaction({
        to: answers.to,
        value: ethers_1.ethers.parseEther(answers.amount),
    });
    console.log(`Transaction sent. Hash: ${tx.hash}`);
});
exports.default = sendTransaction;
