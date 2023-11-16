const encryptRSA = require('../services/criptografarRSAService')

const renderEncryptedMessage = (data) => {

    const result = encryptMessage(data)

    return { message: result.message, key: result.key }
}

function encryptMessage (data) {


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


    function uint8ArrayToHex(uint8Array) {
        return Array.from(uint8Array)
            .map(byte => ('0' + byte.toString(16)).slice(-2))
            .join('')
            .padStart(Math.ceil(uint8Array.length * 2), '0');
    }


    // Obter a data e hora atual como semente
    let seed = new Date().getTime();

    // Função para gerar números pseudoaleatórios
    function pseudoRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    // Gerar uma chave de 16 bytes
    let randomKey = [];
    for (let i = 0; i < 16; i++) {
        seed = seed * 16807 % 2147483647; // LCG (Linear Congruential Generator) para gerar números pseudoaleatórios
        randomKey.push(Math.floor(pseudoRandom(seed) * 256)); // Converter para um byte (0-255)
    }

    // IV
    let iv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];

    // Dados a serem cifrados
    let recievedText = data.message;

    // Converter a string para um array de bytes
    let textEncoder = new TextEncoder();
    let plaintextBytes = textEncoder.encode(recievedText);

    // Adicionar preenchimento aos dados de entrada
    let paddedData = addPadding(plaintextBytes);

    // Cifrar os dados
    let encryptedDataWithIV = aes256CBCEncrypt(paddedData, randomKey, iv);

    let encryptedHex = uint8ArrayToHex(encryptedDataWithIV);

    let randomKeyHex = uint8ArrayToHex(randomKey)

    let randomKeyForUserEncrypeted = encryptRSA(randomKeyHex, data.publicKey);

    return { message: encryptedHex, key: randomKeyForUserEncrypeted }
}



module.exports = { renderEncryptedMessage }