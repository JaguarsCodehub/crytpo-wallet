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
const commander_1 = require("commander");
const createWallet_1 = __importDefault(require("./commands/createWallet"));
const loadWallet_1 = __importDefault(require("./commands/loadWallet"));
const sendTransaction_1 = __importDefault(require("./commands/sendTransaction"));
const program = new commander_1.Command();
program
    .command('create-wallet')
    .description('Create a new wallet')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, createWallet_1.default)();
}));
program
    .command('load-wallet')
    .description('Load an existing wallet')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, loadWallet_1.default)();
}));
program
    .command('send-transaction')
    .description('Send a transaction')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendTransaction_1.default)();
}));
program.parse(process.argv);
