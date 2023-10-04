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
                Insira abaixo a chave privada da mensagem na qual você deseja descriptografar.</span><br />
            </div>
            <div class="box-keys">
              <p>Chave Privada: </p> <input v-model="text" ref="button" placeholder="DKFSFKSGK" id="keypr" disabled>
            </div>
            <input class="box-button" type="button" value="DESCRIPTOGRAFAR" @click="teste" />
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
  