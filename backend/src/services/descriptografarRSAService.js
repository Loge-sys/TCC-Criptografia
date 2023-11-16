const bigInt = require("big-integer");

function decryptRSA(cipherText, privateKeyHex) {
    const privateKey = hexToObject(privateKeyHex);
    const { p, q, d } = privateKey;
    const n = p * q;
    cipherText = hexToObject(cipherText);
    const plainText = cipherText.map(char => 
        String.fromCharCode(Number(bigInt(char).modPow(d, n).toString())));

    return plainText.join('');
}

function hexToObject(hexString) {
    const jsonString = Buffer.from(hexString, 'hex').toString('utf-8');
    const obj = JSON.parse(jsonString);
    return obj;
  }


module.exports = decryptRSA;