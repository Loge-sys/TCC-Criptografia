// Função para realizar a operação XOR entre dois arrays de bytes
function xorBytes(a, b) {
    let result = [];
    for (let i = 0; i < a.length; i++) {
        result.push(a[i] ^ b[i]);
    }
    return new Uint8Array(result);
}

// Função para realizar a substituição de bytes de acordo com a S-Box do AES
function subBytes(state) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            state[i][j] = sBox[state[i][j]];
        }
    }
    return state;
}

// Função para realizar o deslocamento de linhas no estado
function shiftRows(state) {
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < i; j++) {
            // Rotacionar a linha i à esquerda
            let temp = state[i][0];
            for (let k = 0; k < 3; k++) {
                state[i][k] = state[i][k + 1];
            }
            state[i][3] = temp;
        }
    }
    return state;
}

// Função para multiplicação de bytes no campo finito
function mixColumns(state) {
    for (let i = 0; i < 4; i++) {
        let a = state[i][0];
        let b = state[i][1];
        let c = state[i][2];
        let d = state[i][3];

        state[i][0] = multiply(a, 0x02) ^ multiply(b, 0x03) ^ c ^ d;
        state[i][1] = a ^ multiply(b, 0x02) ^ multiply(c, 0x03) ^ d;
        state[i][2] = a ^ b ^ multiply(c, 0x02) ^ multiply(d, 0x03);
        state[i][3] = multiply(a, 0x03) ^ b ^ c ^ multiply(d, 0x02);
    }
    return state;
}

// Função auxiliar para multiplicação de bytes no campo finito
function multiply(a, b) {
    if (a === 0x01) {
        return b;
    } else if (b === 0x01) {
        return a;
    } else {
        let result = 0;
        let carry;
        for (let i = 0; i < 8; i++) {
            if (b & 1) {
                result ^= a;
            }
            carry = a & 0x80;
            a <<= 1;
            if (carry) {
                a ^= 0x1b; // irreducible polynomial: x^8 + x^4 + x^3 + x + 1
            }
            b >>= 1;
        }
        return result;
    }
}
// Tabelas S-Box e Rcon para o AES
const sBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x16, 0x21, 
    0xd9, 0x38, 0x0b, 0x28, 0x32, 0x43, 0x22, 0x97, 0x85, 0x97, 0xa2, 0x84, 0x91, 0x8a, 0xee, 0x7a, 
    0x0c, 0xa9, 0x6d, 0xef, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const rcon = [
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a,
    0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91
];


// Função para expandir a chave de 256 bits para as subchaves do AES
function keyExpansion(key) {
    let roundKeys = [];
    for (let i = 0; i < 60; i++) {
        if (i < 8) {
            roundKeys.push(key[i]);
        } else if (i % 8 === 0) {
            let temp = roundKeys.slice(i - 4, i);
            temp = temp.map((byte, index) => sBox[index === 0 ? byte ^ rcon[i / 8] : byte]);
            roundKeys.push(xorBytes(temp, roundKeys.slice(i - 8, i - 4)));
        } else {
            roundKeys.push(xorBytes(roundKeys.slice(i - 8, i - 4), roundKeys.slice(i - 4, i)));
        }
    }
    return roundKeys;
}

// Função principal para cifrar dados usando AES 256 CBC
function aes256CBCEncrypt(data, key, iv) {
    // Verificar se os dados têm tamanho múltiplo de 16 bytes (bloco AES)
    if (data.length % 16 !== 0) {
        throw new Error("Tamanho dos dados deve ser múltiplo de 16 bytes");
    }

    // Converter chave e IV para arrays de bytes
    key = new Uint8Array(key);
    iv = new Uint8Array(iv);

    // Expandir a chave
    let roundKeys = keyExpansion(key);

    // Inicializar o vetor de inicialização (IV)
    let state = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        state[i] = iv[i];
    }

    // Cifrar dados em blocos de 16 bytes usando AES 256 CBC
    for (let i = 0; i < data.length; i += 16) {
        // XOR estado com bloco de dados
        state = xorBytes(state, data.slice(i, i + 16));

        // Executar 14 rodadas de AES (última rodada é tratada separadamente)
        for (let j = 0; j < 14; j++) {
            // Adicionar chave de rodada ao estado
            let roundKey = roundKeys.slice(j * 4, (j + 1) * 4);
            state = xorBytes(state, roundKey);

            // Substituição de bytes
            state = subBytes(state);

            // Deslocamento de linhas
            state = shiftRows(state);

            // Mistura de colunas (exceto na última rodada)
            if (j < 13) {
                state = mixColumns(state);
            }
        }

        // Concatenar IV cifrado com dados cifrados
        let encryptedBlock = new Uint8Array(16);
        for (let k = 0; k < 16; k++) {
            encryptedBlock[k] = state[k];
        }

        // Salvar o bloco cifrado
        data.set(encryptedBlock, i);
    }
    let encryptedDataWithIV = new Uint8Array(iv.length + data.length);
    encryptedDataWithIV.set(iv);
    encryptedDataWithIV.set(data, iv.length);

    return encryptedDataWithIV;
}

// Função para adicionar preenchimento PKCS7 aos dados
function addPadding(data) {
    const blockSize = 16;
    const paddingSize = blockSize - (data.length % blockSize);
    const padding = new Uint8Array(paddingSize).fill(paddingSize);
    return new Uint8Array([...data, ...padding]);
}


// Função para desfazer o deslocamento de linhas
function inverseShiftRows(state) {
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < i; j++) {
            // Rotacionar a linha i à direita
            let temp = state[i][0];
            for (let k = 0; k < 3; k++) {
                state[i][k] = state[i][k + 1];
            }
            state[i][3] = temp;
        }
    }
    return state;
}

// Função para desfazer a operação MixColumns
function inverseMixColumns(state) {
    for (let i = 0; i < 4; i++) {
        let a = state[i][0];
        let b = state[i][1];
        let c = state[i][2];
        let d = state[i][3];

        state[i][0] = multiply(a, 0x0e) ^ multiply(b, 0x0b) ^ multiply(c, 0x0d) ^ multiply(d, 0x09);
        state[i][1] = multiply(a, 0x09) ^ multiply(b, 0x0e) ^ multiply(c, 0x0b) ^ multiply(d, 0x0d);
        state[i][2] = multiply(a, 0x0d) ^ multiply(b, 0x09) ^ multiply(c, 0x0e) ^ multiply(d, 0x0b);
        state[i][3] = multiply(a, 0x0b) ^ multiply(b, 0x0d) ^ multiply(c, 0x09) ^ multiply(d, 0x0e);
    }
    return state;
}

// Função principal para decifrar dados usando AES 256 CBC
function aes256CBCDecrypt(dataWithIV, key, iv) {
    // Separar IV dos dados cifrados
    let ivCiphertext = dataWithIV.slice(0, iv.length);
    let ciphertext = dataWithIV.slice(iv.length);

    // Decifrar dados em blocos de 16 bytes usando AES 256 CBC
    let decryptedData = new Uint8Array(ciphertext.length);

    for (let i = 0; i < ciphertext.length; i += 16) {
        // Salvar o bloco cifrado para posterior uso
        let cipherBlock = new Uint8Array(ciphertext.slice(i, i + 16));

        // Inverter as transformações feitas durante a cifragem
        for (let j = 14; j >= 0; j--) {
            // Adicionar chave de rodada ao bloco de cifra (inverso da cifragem)
            cipherBlock = xorBytes(cipherBlock, roundKeys.slice(j * 4, (j + 1) * 4));

            // Desfazer MixColumns (exceto na primeira rodada)
            if (j < 14) {
                cipherBlock = inverseMixColumns(cipherBlock);
            }

            // Desfazer ShiftRows e SubBytes
            cipherBlock = inverseShiftRows(cipherBlock);
        }

        // XOR com o bloco anterior para todos os blocos, exceto o primeiro
        if (i > 0) {
            cipherBlock = xorBytes(cipherBlock, new Uint8Array(ciphertext.slice(i - 16, i)));
        } else {
            cipherBlock = xorBytes(cipherBlock, iv);
        }

        // Salvar o bloco decifrado
        decryptedData.set(cipherBlock, i);
    }

    // Remover o preenchimento PKCS7
    decryptedData = removePadding(decryptedData);

    return decryptedData;
}

// Função para remover o preenchimento PKCS7 dos dados decifrados
function removePadding(data) {
    const paddingSize = data[data.length - 1];
    return data.slice(0, data.length - paddingSize);
}

function uint8ArrayToHex(uint8Array) {
    return Array.from(uint8Array).map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
}


// Tabela inversa S-Box para desfazer a substituição de bytes
const inverseSBox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

// Chave e IV
let key = [0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x97, 0x75, 0x46, 0x20, 0x63, 0xed];
let iv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];
let roundKeys = keyExpansion(key);

// Dados a serem cifrados
let plaintext = "TESEEEE";

// Converter a string para um array de bytes
let textEncoder = new TextEncoder();
let plaintextBytes = textEncoder.encode(plaintext);

// Adicionar preenchimento aos dados de entrada
let paddedData = addPadding(plaintextBytes);

// Cifrar os dados
let encryptedDataWithIV = aes256CBCEncrypt(paddedData, key, iv);
console.log("Dados cifrados (em bytes):", encryptedDataWithIV);

// Decifrar os dados
let decryptedData = aes256CBCDecrypt(encryptedDataWithIV, key, iv);

// Converter os bytes decifrados de volta para a string original
let textDecoder = new TextDecoder();
let decryptedString = textDecoder.decode(decryptedData);

console.log("Dados decifrados (como string):", decryptedString);