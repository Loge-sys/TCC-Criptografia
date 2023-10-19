const express = require('express')
const criptografarAes = require('./controllers/criptografia')
const router = express.Router()

router.post('/encrypt-message', criptografarAes.getEncryptedMessage)
router.post('/decrypt-message', criptografarAes.getDecryptedMessage)

module.exports = router