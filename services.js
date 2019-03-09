const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const BigNumber = require('big-number');
const { INFURA_API } = require('./setting');
const { ABI } = require('./abi');
const { defaultWeb3 } = require('./get-default-web3');
const { mustBeAddress, mustBeNumber, makeSure } = require('./validators');

async function transfer(contractAddress, privateKey, to, tokens, gasPriceInGwei) {
    mustBeNumber(gasPriceInGwei);
    mustBeNumber(tokens);
    mustBeAddress(contractAddress);
    mustBeAddress(to);
    const amount = (new BigNumber(tokens)).multiply(new BigNumber(1e18)).toString();
    const gasPrice = (new BigNumber(tokens)).multiply(new BigNumber(1e9)).toString();
    const provider = new HDWalletProvider(privateKey, INFURA_API);
    const web3 = new Web3(provider);
    const erc20 = new web3.eth.Contract(ABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    try {
        const gas = await erc20.methods.transfer(to, amount).estimateGas({ from: accounts[0] });
        const txHash = await sendTransferTransaction(erc20, to, amount, accounts[0]);
        return { success: true, gas, txHash };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getTransactionInfo(txHash) {
    try {
        const response = await defaultWeb3.eth.getTransactionReceipt(txHash);
        return { success: true, ...response, mined: !!response };
    } catch (error) {
        return { success: false, message: 'INVALID_TX_HASH' };
    }
}

async function getBalance(contractAddress, userAddress) {
    mustBeAddress(contractAddress, 'INVALID_CONTRACT_ADDRESS');
    mustBeAddress(userAddress, 'INVALID_USER_ADDRESS');
    try {
        const erc20 = new defaultWeb3.eth.Contract(ABI, contractAddress);
        const balanceRespone = await erc20.methods.balanceOf(userAddress).call();
        const decimals = await erc20.methods.decimals().call();
        return {  success: true, contractAddress, userAddress, balance: balanceRespone, decimals };
    } catch (error) {
        console.log(error);
        throw { success: false, error: error.message };
    }
}

function sendTransferTransaction (erc20, to, amount, account) {
    return new Promise((resolve, reject) => {
        erc20.methods.transfer(to, amount).send({ from: account })
        .on('transactionHash', hash => resolve(hash));
    });
}

module.exports = { transfer, sendTransferTransaction, getTransactionInfo, getBalance };
