const bigInt = require("big-integer");

const renderGenerateKeys = () => {
    // Definindo o comprimento dos bits para a geração de chaves
    const bit_length = 25;
    const [publicKey, privateKey] = generateKeypair(bit_length);
    const privateKeyHex = objectToHex(privateKey);
    const publicKeyHex = objectToHex(publicKey);
    return { privateKey: `${privateKeyHex}`, publicKey: `${publicKeyHex}` };
}

// Verifica se um número é primo
function isPrime(num) {
    if (num < 2) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

// Gera um número primo aleatório com um número específico de bits
function generatePrime(bits) {
    while (true) {
        const num = Math.floor(Math.random() * (2 ** bits));
        if (isPrime(num)) {
            return num;
        }
    }
}

// Calcula o maior divisor comum de dois números
function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Calcula o inverso modular de 'a' em relação a 'm'
function modInverse(a, m) {
    let [m0, x0, x1] = [m, 0, 1];
    while (a > 1) {
        const q = Math.floor(a / m);
        [m, a] = [a % m, m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 + m0 * (x1 < 0 ? 1 : 0);
}

// Gera um par de chaves pública e privada
function generateKeypair(bits) {
    // Gera dois números primos
    const p = generatePrime(bits);
    const q = generatePrime(bits);

    // Calcula 'n', 'phi', 'e', e 'd'
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    let e = Math.floor(Math.random() * phi);
    while (gcd(e, phi) !== 1) {
        e = Math.floor(Math.random() * phi);
    }
    const d = modInverse(e, phi);

    // Cria as chaves pública e privada
    const publicKey = { n, e };
    const privateKey = { p, q, d };

    return [publicKey, privateKey];
}

// Converte um objeto para uma representação hexadecimal
function objectToHex(obj) {
    const jsonString = JSON.stringify(obj);
    const hexString = Buffer.from(jsonString, 'utf-8').toString('hex');
    return hexString;
}

module.exports = { renderGenerateKeys }