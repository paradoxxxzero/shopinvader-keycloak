<script setup>
import User from './components/User.vue'
import Cart from './components/Cart.vue'
import Actions from './components/Actions.vue'
import { ref } from 'vue'

const { keycloak } = defineProps({
  keycloak: Object,
})

const websiteKey = ref("7f55d20526d3053edef00b8a15c7a64c9e4e827bb777ed9e7edc3a54d5c95f18")
const websiteUrl = ref("http://noukies.localhost/shopinvader_jwt/")


const login = () => {
  // After login we redirect to main page
  keycloak.login()
}
const logout = () => {
  // After logout we redirect to main page
  keycloak.logout()
}

const register = () => {
  // After register we redirect to the registration page of shopinvader
  keycloak.register({
    redirectUri: `${window.location.origin}/register`,
  })
}

// Use a real router instead
const registering = ref(window.location.pathname == "/register")

</script>

<template>
  <a href="/">
    <img class="logo" alt="Shopping cart" src="./assets/logo.svg" />
  </a>
  <header>
    <User :user="keycloak.tokenParsed" :registering="registering" />
  </header>
  <section v-if="!registering">
    <Cart
      v-if="keycloak.authenticated"
      :websiteKey="websiteKey"
      :websiteUrl="websiteUrl"
      :token="keycloak.token"
    />
    <Actions :auth="keycloak.authenticated" @login="login" @logout="logout" @signup="register" />
  </section>
  <footer>
    <label>
      shopinvader website unique key
      <input v-model="websiteKey" />
    </label>
    <label>
      shopinvader url
      <input v-model="websiteUrl" />
    </label>
  </footer>
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
footer {
  position: fixed;
  bottom: 0;
}
</style>
