const criptografarAesService = require('../services/criptografarAesService')
const descriptografarAesService = require('../services/descriptografarAesService')

const getEncryptedMessage = (req, res) => {
    const encryptedMessage = criptografarAesService.renderEncryptedMessage(req.body)

    return res.status(200).send({ encryptedMessage: encryptedMessage.message, encryptedKey: encryptedMessage.key })
}

const getDecryptedMessage = (req, res) => {
    const decryptedMessage = descriptografarAesService.renderDecryptedMessage(req.body)

    return res.status(200).send({ decryptedMessage: decryptedMessage.message })
}

module.exports = { getEncryptedMessage, getDecryptedMessage }