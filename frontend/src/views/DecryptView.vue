<template>
  <div class="app">
    <div class="container">
      <div class="row">
        <div class="nav-menu">
          <div class="col-md-12">
            <button @click="navigateTo('/EncryptView')" :class="{ 'active': $route.path === '/EncryptView' }">
              Criptografar
            </button>
            <button @click="navigateTo('/DecryptView')" :class="{ 'active': $route.path === '/DecryptView' }">
              Descriptografar
            </button>
          </div>
        </div>
        <div class="col-md-12">
          <div class="box text-center">
            <div class="box-back">
              <a href="/">
                <font-awesome-icon icon="fa-solid fa-arrow-left" style="color: #000000;" size="2xl" />
              </a>
            </div>
            <div class="box-title">
              <h1>TCC</h1>
            </div>
            <div class="box-content">
              <h3>Descriptografar mensagem</h3>
              <span>
                Insira abaixo a chave privada da mensagem na qual você deseja descriptografar.
              </span>
              <br />
              <span>Mensagem criptograda:</span><br />
              <textarea v-model="message"></textarea>
            </div>
            <div class="box-keys">
              <p>Chave Privada: </p> <input v-model="privateKey" ref="button" id="keypr">
            </div>
              <div class="box-content">
              <span>Chave criptografada:</span><br />
              <textarea v-model="encrypetedKey"></textarea>
            </div>
            <input class="box-button" type="button" value="DESCRIPTOGRAFAR" @click="descriptografar" />
            <div v-show="buscou" class="box-content">
              <span>Mensagem descriptograda:</span><br />
              <textarea v-model="decryptedMessage" readonly></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { URL } from '../webservice/index'
import axios from 'axios'
export default {
  data: function () {
      return {
        privateKey: '',
        message: '',
        loading: false,
        buscou: false,
        decryptedMessage: ''
      }
    },
  methods: {
    async descriptografar() {
      try {
          this.loading = false
          const res = await axios.post(`${URL}/decrypt-message`, { privateKey: this.privateKey, message: this.message, key: this.encrypetedKey })
          this.decryptedMessage = res.data.decryptedMessage
          if (res) this.buscou = true
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>
  