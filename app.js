const express = require('express');
const { json } = require('body-parser');
const { transfer, getBalance, getTransactionInfo } = require('./services');
const app = express();

app.use(json());

app.get('/', (req, res) => res.send({ success: true, message: 'OK' }));

app.post('/transfer', (req, res) => {
    const { contractAddress, privateKey, toAddress, tokens, gasPriceInGwei } = req.body;
    transfer(contractAddress, privateKey, toAddress, tokens, gasPriceInGwei)
    .then(result => res.send(result))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.get('/balance/:contractAddress/:userAddress', (req, res) => {
    const { contractAddress, userAddress } = req.params;
    getBalance(contractAddress, userAddress)
    .then(result => res.send(result))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.get('/transaction/:txHash', (req, res) => {
    const { txHash } = req.params;
    getTransactionInfo(txHash)
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));
