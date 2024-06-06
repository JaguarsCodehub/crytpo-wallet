import fs from 'fs'
import path from 'path'
import {ethers} from 'ethers'
import axios from "axios";
import loadWallet from "./loadWallet";
import Wallet from "ethereumjs-wallet";

// Function to fetch ETH Balance
const fetchEthBalance = async (walletAddress: string, provider: ethers.JsonRpcProvider): Promise<string> => {
    const balance = await provider.getBalance(walletAddress);
    return ethers.formatEther(balance)
}

// Function to fetch ERC-20 token balances
const fetchTokenBalances = async (walletAddress: string, provider: ethers.JsonRpcProvider, tokenAddresses: string[]): Promise<any[]> => {
    const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
    ];

    const balances = [];

    for (const address of tokenAddresses) {
        const contract = new ethers.Contract(address, erc20Abi, provider);
        const balance = await contract.balanceOf(walletAddress);
        const decimals = await contract.decimals()
        const symbol = await contract.symbol()

        balances.push({
            token: symbol,
            balance: ethers.formatUnits(balance, decimals)
        })
    }


    return balances;

}

//Function to fetch NFT DATA from OPENSEA
const fetchNFTs = async(walletAddress: string): Promise<any[]> => {
    const url = `https://api.opensea.io/api/v1/assets?owner=${walletAddress}`;
    const response = await axios.get(url);
    const assets = response.data.assets;


    return assets.map((asset: any) => ({
        name: asset.name,
        description: asset.description,
        image_url: asset.image_url,
    }))
}

// Function to load and display wallet activity

const displayWalletActivity = async(): Promise<void> => {

    const wallet: Wallet = <Wallet>await loadWallet();
    if (!wallet) {
        console.log("Failed to load Wallet or wallet not found")
    }


    const rpcUrl = "https://sepolia.infura.io/v3/11fae889e51641238411d5fcebf16246";
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const walletAddress = wallet.getAddressString()

    console.log(`Fetching activity for wallet: ${walletAddress}`)

    //Fetch ETH BALANCE
    const ethBalance = await fetchEthBalance(walletAddress, provider)
    console.log(`WAllet ETH balance: ${ethBalance}`)


    // Fetch NFT DATA
    const nfts = await fetchNFTs(walletAddress);
    console.log("NFTs: ");
    nfts.forEach(nft => console.log(`${nft.name}: ${nft.description} - ${nft.image_url}`))


    // Fetch transaction history
    const transactionFile = path.join(__dirname, '..', 'transactions.json');
    let transactions = [];
    if (fs.existsSync(transactionFile)) {
        transactions = JSON.parse(fs.readFileSync(transactionFile, 'utf-8'));
    }
    console.log('Transaction History:');
    transactions.forEach((tx: any) => {
        const status = tx.blockNumber ? 'confirmed' : 'pending'; // Check if transaction is confirmed or pending
        console.log(`Transaction Hash: ${tx.hash}`);
        console.log(`Sender Address: ${tx.from}`);
        console.log(`Recipient Address: ${tx.to}`);
        console.log(`Amount Sent: ${tx.value} Wei`);
        console.log(`Status: ${status}`);
        console.log('-----------------------------');
    });
}

displayWalletActivity().catch(console.error);

export default displayWalletActivity
