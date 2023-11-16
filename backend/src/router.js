const express = require('express')
const criptografarController = require('./controllers/criptografia')
const router = express.Router()

router.post('/encrypt-message', criptografarController.getEncryptedMessage)
router.post('/decrypt-message', criptografarController.getDecryptedMessage)
router.get('/generate-keys', criptografarController.getGeneratedKeys)

module.exports = router