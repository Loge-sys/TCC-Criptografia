
const renderDecryptedMessage = (data) => {

    const result = decryptMessage(data)

    return { message: result.message, key: result.key }
}

function decryptMessage (data) {

    // Função para realizar a operação XOR entre dois arrays de bytes
    function xorBytes(a, b) {
        let result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(a[i] ^ b[i]);
        }
        return new Uint8Array(result);
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

    // Função principal para decifrar dados usando AES 256 CBC
    function aes256CBCDecrypt(dataWithIV, key, iv) {
        // Separar IV dos dados cifrados
        let ciphertext = dataWithIV.slice(iv.length);
        let roundKeys = keyExpansion(key)

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


    function hexToUint8Array(hex) {
        if (hex.length % 2 !== 0) {
            throw new Error("A string hexadecimal deve ter um número par de caracteres.");
        }

        const uint8Array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return uint8Array;
    }


    // Chave e IV
    let iv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];
    let randomKeyRecieved = hexToUint8Array(data.key);

    // Dados a serem cifrados
    let recievedMessage = data.message;

    let encryptedUint8Array = hexToUint8Array(recievedMessage);

    // Decifrar os dados
    let decryptedData = aes256CBCDecrypt(encryptedUint8Array, randomKeyRecieved, iv);

    console.log('Antes:', encryptedUint8Array)
    
    console.log(decryptedData)
    // Converter os bytes decifrados de volta para a string original
    let textDecoder = new TextDecoder();
    let decryptedString = textDecoder.decode(decryptedData);


    return { message: decryptedString }

}


module.exports = { renderDecryptedMessage }