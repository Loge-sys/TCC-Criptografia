// Função para calcular o maior divisor comum (GCD)
function gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b); 
    if (b === BigInt(0)) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

// Função para calcular o inverso modular (mod_inverse)
function mod_inverse(a, m) {
    a = BigInt(a); 
    m = BigInt(m);

    for (let x = BigInt(1); x < m; x++) {
        if ((a * x) % m === BigInt(1)) {
            return x;
        }
    }
    return -1;
}

// Função para verificar se um número é primo (isprime)
function isprime(n) {
    if (n < 2) {
        return false;
    } else if (n === BigInt(2)) { 
        return true;
    } else {
        for (let i = BigInt(2); i <= BigInt(Math.sqrt(Number(n))); i += BigInt(2)) { 
            if (n % i === BigInt(0)) {
                return false;
            }
        }
    }
    return true;
}

// Função para gerar um número primo aleatório no intervalo [min, max]
function randomPrime(min, max) {
    let prime;
    do {
        prime = getRandomInt(min, max);
    } while (!isprime(prime));
    return prime;
}

// Função para gerar um par de chaves RSA
function generate_keypair(keysize) {
    // keysize é o tamanho em bits de n
    let nMin = BigInt(1) << BigInt(keysize - 1);
    let nMax = (BigInt(1) << BigInt(keysize)) - BigInt(1);
    let primes = [BigInt(2)];
    let p, q;
    const start = BigInt(1) << BigInt(Math.floor(keysize / 2) - 1);
    const stop = BigInt(1) << BigInt(Math.floor(keysize / 2) + 1);

    if (start >= stop) {
        return [];
    }

    for (let i = 3n; i <= stop; i += 2n) {
        let isPrime = true;
        for (const prime of primes) {
            if (i % prime === 0n) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
    }

    while (primes.length > 0 && primes[0] < start) {
        primes.shift();
    }

    while (primes.length > 0) {
        p = primes[Math.floor(Math.random() * primes.length)];
        primes = primes.filter(q => nMin <= p * q && p * q <= nMax);
        if (primes.length > 0) {
            q = primes[Math.floor(Math.random() * primes.length)];
            break;
        }
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    let e, d, g;
    do {
        e = getRandomInt(1, Number(phi));
        g = gcd(e, phi);
        [d] = [mod_inverse(e, phi)];
    } while (g !== 1n || e === d);

    return [{ e, n }, { d, n }];
}

// Função para criptografar uma mensagem
function encrypt(msg_plaintext, publicKey) {
    const { e, n } = publicKey;
    const msg_ciphertext = [];
    for (const c of msg_plaintext) {
        msg_ciphertext.push(BigInt(modPow(c.charCodeAt(0), e, n)));
    }
    return msg_ciphertext;
}

// Função para descriptografar uma mensagem
function decrypt(msg_ciphertext, privateKey) {
    const { d, n } = privateKey;
    const msg_plaintext = [];
    for (const c of msg_ciphertext) {
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

// Função para gerar um número inteiro aleatório no intervalo [min, max]
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Driver program
async function main() {
    const bit_length = 25;
    console.log("Running RSA...");
    console.log("Generating public/private keypair...");
    const [publicKey, privateKey] = generate_keypair(bit_length);
    console.log("Public Key:", publicKey);
    console.log("Private Key:", privateKey);
    const msg = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    // console.log([...msg].map(c => c.charCodeAt(0)));
    const encrypted_msg = encrypt(msg, publicKey);
    console.log("Encrypted msg:");
    console.log(encrypted_msg.map(c => c.toString()).join(''));
    console.log("Decrypted msg:");
    console.log(decrypt(encrypted_msg, privateKey));
}

main();