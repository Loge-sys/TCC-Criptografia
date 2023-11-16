const bigInt = require("big-integer");

const encryptRSA = (message, publicKeyHex) => {
    const publicKey = hexToObject(publicKeyHex);
    const { n, e } = publicKey;
    const cipherText = message
        .split('')
        .map(char => bigInt(char.charCodeAt(0)).modPow(e, n).toString());

    return objectToHex(cipherText);
}

function objectToHex(obj) {
    const jsonString = JSON.stringify(obj);
    const hexString = Buffer.from(jsonString, 'utf-8').toString('hex');
    return hexString;
  }

function hexToObject(hexString) {
    const jsonString = Buffer.from(hexString, 'hex').toString('utf-8');
    const obj = JSON.parse(jsonString);
    return obj;
  }

module.exports = encryptRSA;