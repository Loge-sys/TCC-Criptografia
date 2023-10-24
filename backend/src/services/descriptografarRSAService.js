// Função para descriptografar uma mensagem
function decryptRSA(msg_ciphertext, privateKey) {
    console.log(msg_ciphertext)
    console.log(privateKey)
    let splitValues = privateKey.split('#')
    const d = BigInt(splitValues[0])
    const n = BigInt(splitValues[1])
    let msg_plaintext = ''
    for (const c of msg_ciphertext) {
        const decryptedChar = String.fromCharCode(Number(modPow(c, d, n)))
        msg_plaintext += decryptedChar
    }
    return msg_plaintext;
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