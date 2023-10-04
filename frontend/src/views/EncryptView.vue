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
              <input v-model="text" ref="button" placeholder="DKFSFKSGK" id="keypu" disabled>
              <br />
            </div>
            <input class="box-button" type="button" value="CRIPTOGRAFAR" @click="teste" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  methods: {
    teste() {
      alert("teste");
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>
  