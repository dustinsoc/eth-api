const { defaultWeb3 } = require('./get-default-web3');
const BigNumber = require('big-number');

class ServerError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
    }
}

function makeSure(expression, message, statusCode = 400) {
    if (expression) return;
    throw new ServerError(message, statusCode);
}

var isAddress = function (address) {
    // function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}

var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = defaultWeb3.utils.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}

function mustBeAddress(address, message = 'INVALID_ADDRESS') {
    makeSure(isAddress(address ? ('' + address).toLowerCase() : ''), message);
}

function mustBeNumber(num, message = 'INVALID_NUMBER') {
    makeSure(Number.isInteger(+num), message);
}

module.exports = { makeSure, mustBeAddress, mustBeNumber };
