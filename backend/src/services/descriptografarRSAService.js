function decryptRSA(msg_ciphertext, privateKey) {
    let splitValues = privateKey.split('#');
    const d = BigInt(splitValues[0]);
    const n = BigInt(splitValues[1]);
    let msg_plaintext = [];

    const parts = msg_ciphertext.split("#");
    const lastPart = parts.pop();
    const concatenatedString = parts.join("#") + lastPart;
    const charList = concatenatedString.split("#").map(x => BigInt(x))
    for (const c of charList) {
        msg_plaintext.push(String.fromCharCode(Number(modPow(c, d, n))));
    }

    return msg_plaintext.join('');
}
// Função para elevar a uma potência com módulo
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


module.exports = decryptRSA;