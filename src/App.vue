<script setup>
import User from './components/User.vue'
import Cart from './components/Cart.vue'
import Actions from './components/Actions.vue'

const props = defineProps({
  auth: Boolean,
  keycloak: Object,
})


</script>

<template>
  <img class="logo" alt="Shopping cart" src="./assets/logo.svg" />
  <header>
    <User :authUser="keycloak.tokenParsed" />
  </header>
  <section>
    <Cart />
    <Actions :auth="keycloak.authenticated" @login="keycloak.login" @logout="keycloak.logout" />
  </section>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 200px;
  margin: 0 auto;
}
section {
  display: flex;
  justify-content: space-evenly;
}
</style>
