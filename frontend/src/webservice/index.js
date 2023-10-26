import axios from 'axios'

export const URL = 'http://localhost:3333'


export const gerarChaves = async () => {
    return await axios.get(`${URL}/generate-keys`)
}