<script setup>
import User from './components/User.vue'
import CartService from './cart.js'
import Actions from './components/Actions.vue'
import { ref, watch } from 'vue'
import Cart from './components/Cart.vue'

const { keycloak } = defineProps({
  keycloak: Object,
})

const websiteKey = ref(localStorage.getItem("websiteKey"))
const websiteUrl = ref(localStorage.getItem("websiteUrl"))
watch(websiteKey, (newValue) => {
  localStorage.setItem("websiteKey", newValue)
})
watch(websiteUrl, (newValue) => {
  localStorage.setItem("websiteUrl", newValue)
})


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

// Use a real service
const cart = new CartService(websiteKey, websiteUrl, keycloak.token, keycloak.tokenParsed?.email)
const refresh = cart.get.bind(cart)
const addItem = cart.addItem.bind(cart)
const clear = cart.clear.bind(cart)

window.cart = cart

// Use a real router instead
const registering = ref(window.location.pathname == '/register')
</script>

<template>
  <a href="/">
    <img class="logo" alt="Shopping cart" src="./assets/logo.svg" />
  </a>
  <header>
    <User
      :auth="keycloak.authenticated"
      :user="keycloak.tokenParsed"
      :registering="registering"
      @login="login"
      @logout="logout"
      @register="register"
    />
  </header>
  <section v-if="!registering && keycloak.authenticated">
    <Cart :cart="cart.cart" @refresh="refresh" @clear="clear" />
    <Actions @add-item="addItem" />
  </section>
  <footer>
    <label>
      shopinvader website unique key
      <input v-model="websiteKey" />
    </label>
    <label>
      shopinvader url
      <input
        v-model="websiteUrl"
        placeholder="http://localhost:8069/shopinvader_jwt/"
      />
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
