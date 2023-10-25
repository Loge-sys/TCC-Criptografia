const criptografarAesService = require('../services/criptografarAesService')
const descriptografarAesService = require('../services/descriptografarAesService')
const gerarChavesRSAService =  require('../services/gerarChavesRSAService')

const getEncryptedMessage = (req, res) => {
    const encryptedMessage = criptografarAesService.renderEncryptedMessage(req.body)

    return res.status(200).send({ encryptedMessage: encryptedMessage.message, encryptedKey: encryptedMessage.key })
}

const getDecryptedMessage = (req, res) => {
    const decryptedMessage = descriptografarAesService.renderDecryptedMessage(req.body)

    return res.status(200).send({ decryptedMessage: decryptedMessage.message })
}

const getGenerateKeys = (req, res) => {
    const keys = gerarChavesRSAService.renderGenerateKeys()
    console.log(keys)

    return res.status(200).send({ privateKey: keys.privateKey, publicKey: keys.publicKey})
}

module.exports = { 
    getEncryptedMessage, 
    getDecryptedMessage, 
    getGenerateKeys 
}