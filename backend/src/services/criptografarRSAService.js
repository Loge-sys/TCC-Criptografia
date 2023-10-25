const encryptRSA = (msg_plaintext, publicKey) => {
    let splitValues = publicKey.split('#');
    const e = BigInt(splitValues[0]);
    const n = BigInt(splitValues[1]);
    let msg_ciphertext = '';
    for (const c of msg_plaintext) {
        msg_ciphertext += BigInt(modPow(c.charCodeAt(0), e, n));
        msg_ciphertext += "#";
    }

    return msg_ciphertext;
}

function modPow(base, exp, mod) {
    base = BigInt(base); 
    exp = BigInt(exp);   
    mod = BigInt(mod);   

    let result = BigInt(1);
    base = base % mod;
    while (exp > BigInt(0)) {
        if (exp % BigInt(2) === BigInt(1)) {
            result = (result * base) % mod;
        }
        exp = exp >> BigInt(1);
        base = (base * base) % mod;
    }
    return result;
}

module.exports = encryptRSA;