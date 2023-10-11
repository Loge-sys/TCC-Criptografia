const express = require('express')
const criptografarAes = require('./controllers/criptografar')
const router = express.Router()

router.post('/encrypt-message', criptografarAes.getEncryptedMessage)

module.exports = router