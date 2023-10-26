<template>
  <div class="app">
  
    <div class="container">
      <div class="row">
        <div class="col-md-12 nav-menu">
          <button @click="navigateTo('/EncryptView')" :class="{ 'active': $route.path === '/EncryptView' }">
            Criptografar
          </button>
          <button @click="navigateTo('/DecryptView')" :class="{ 'active': $route.path === '/DecryptView' }">
            Descriptografar
          </button>
        </div>

        <div class="col-md-12 boxLayout">
          <div class="box text-center">
            <div class="box-title">
              <h1>TCC</h1>
            </div>
            <div class="box-content">
              <h3>Bem vindo!</h3>
              <p>Para dar continuidade ao nosso sistema, é necessário gerar as <strong>chaves RSA (Pública e
                  Privada).</strong>
              </p>
              <p>Em caso de perda das chaves, <strong>não será possível recuperá-las</strong>. Portanto, é de extrema
                importância
                armazená-las em um local seguro.
              </p>
              <br>
            </div>
            <div class="box-keys">
              <span>Chave Pública:</span> <input v-model="publicKey" ref="button" id="keypu" readonly>
              <br />
              <span>Chave Privada: </span> <input v-model="privateKey" ref="button" id="keypr" readonly>
              <p>Clique abaixo para gerar suas chaves:</p>
              <div v-show="loading" class="spinner-border" role="status"/>
            </div>
            
            <input class="box-button" type="button" value="GERAR" @click="gerarChaves" :disabled="loading" />
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
      privateKey: '',
      loading: false
    }
  },
  methods: {
    async gerarChaves() {
      try {
        this.loading = true
        const res = await axios.get(`${URL}/generate-keys`)
        this.publicKey = res.data.publicKey
        this.privateKey = res.data.privateKey
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
      
    },
    navigateTo(route) {
      this.$router.push(route);
    }
  },
};
</script>

<style scoped>
.box-content p {
  font-size: 17px;
  color: #918888;
  margin: 0;
}

.box-keys {
  margin: 0;
}

.box-keys span {
  font-weight: bold;
}

.box-keys input {
  margin: 10px;
  background-color: #F0F0F0;
  border: none;
  border-radius: 6px;
  padding: 5px;
}

.box-button {
  color: #fff;
  font-weight: bold;
  padding: 10px;
  width: 30%;
  border: none;
  border-radius: 6px;
  background: linear-gradient(100deg,
      rgba(46, 236, 168, 1) 0%,
      rgba(25, 231, 207, 1) 50%,
      rgba(0, 224, 255, 1) 100%);
  margin-top: 10px;
}

.box-button:hover {
  background: linear-gradient(100deg,
      rgb(0, 205, 232) 0%,
      rgb(23, 208, 187) 50%,
      rgb(41, 212, 152) 100%);


}
</style>
