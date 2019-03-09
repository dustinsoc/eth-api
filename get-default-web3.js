const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const { INFURA_API } = require('./setting');

function getDefaultWeb3() {
    const DEFAULT_PRIVATE_KEY = '0x00000000000000000000000000000000000000000000000000000000000000';
    const provider = new HDWalletProvider(DEFAULT_PRIVATE_KEY, INFURA_API);
    const web3 = new Web3(provider);
    return web3;
}

const defaultWeb3 = getDefaultWeb3();

module.exports = { defaultWeb3 };
