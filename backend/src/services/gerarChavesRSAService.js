const renderGenerateKeys = () => {
    const bit_length = 25;
    const [publicKey, privateKey] = generate_keypair(bit_length);

    // Retornando ambas as chaves dentro de uma propriedade "keys"
    return { privateKey: `${privateKey.dNumber}#${privateKey.nNumber}`, publicKey: `${publicKey.eNumber}#${publicKey.nNumber}` };
}

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

    let eNumber = Number(e)
    let nNumber = Number(n)
    let dNumber = Number(d)

    
    return [{ eNumber, nNumber }, { dNumber, nNumber }];
}


// Função para gerar um número inteiro aleatório no intervalo [min, max]
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { renderGenerateKeys }