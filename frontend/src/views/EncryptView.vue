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
              <h3>Criptografar mensagem</h3>
              <span>
                Digite abaixo a mensagem que você deseja criptografar e, em seguida, insira a chave pública da pessoa para
                quem você deseja enviar.</span><br />
              <span>Mensagem:</span><br />
              <textarea v-model="message"></textarea>
            </div>
            <div class="box-keys">
              <p>Chave Pública:</p>
              <input v-model="publicKey" ref="button" id="keypu">
              <br />
              <div v-show="loading" class="spinner-border" role="status"/>
            </div>
           <input class="box-button" type="button" value="CRIPTOGRAFAR" @click="criptografar" />

            <div v-show="buscou" class="box-content">
              <p>Mensagem criptografada:</p>
              <textarea v-model="encryptedMessage"></textarea>
              <br />
            </div>
            <div v-show="buscou" class="box-content">
              <p>Chave criptografada: </p>
              <p>Observação: você vai precisar dessa chave para descriptografar a mensagem também. </p>
              <textarea v-model="encryptedKey"></textarea>
              <br />
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
        publicKey: '',
        message: '',
        loading: false,
        buscou: false,
        encryptedMessage: '',
        encryptedKey: ''
      }
    },
    methods: {
      async criptografar() {
        try {
          this.loading = false
          const res = await axios.post(`${URL}/encrypt-message`, { publicKey: this.publicKey, message: this.message })
          this.encryptedMessage = res.data.encryptedMessage
          this.encryptedKey = res.data.encryptedKey
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
  