const criptografarAesService = require('../services/criptografarAesService')

const getEncryptedMessage = (req, res) => {

    const encryptedMessage = criptografarAesService.renderEncryptedMessage()

    return res.status(200).send({ message: encryptedMessage })
}

module.exports = { getEncryptedMessage }