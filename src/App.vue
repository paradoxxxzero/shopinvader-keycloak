<script setup>
import User from './components/User.vue'
import CartService from './services/cart.js'
import Actions from './components/Actions.vue'
import { ref, watch } from 'vue'
import Cart from './components/Cart.vue'
import CustomerService from './services/customer';
import Logo from './components/Logo.vue'

const { keycloaks } = defineProps({
  keycloaks: Object,
  state: String
})

const login = () => {
  // After login we redirect to main page
  keycloaks.auth.login()
}
const logout = () => {
  // After logout we redirect to main page
  keycloaks.auth.logout()
}
const clearGuest = () => {
  // After logout we redirect to main page
  keycloaks.guest.logout()
}

const register = () => {
  // After register we redirect to the registration page of shopinvader
  keycloaks.auth.register({
    redirectUri: `${window.location.origin}/register`,
  })
}

// Use a real router instead
const registering = ref(window.location.pathname == '/register')

// Use a real service
const cart = new CartService(keycloaks)
const customer = new CustomerService(keycloaks, registering.value)

window.cart = cart
window.customer = customer

const refresh = cart.get.bind(cart)
const addItem = cart.addItem.bind(cart)
const removeItem = cart.removeItem.bind(cart)
const clear = cart.clear.bind(cart)

</script>

<template>
  <Logo :state="state" />
  <header>
    <User
      v-if="state.value === 'success'"
      :customerService="customer"
      :registering="registering"
      @login="login"
      @logout="logout"
      @register="register"
    />
  </header>
  <section v-if="!registering && state.value === 'success'">
    <Cart :cartService="cart" @refresh="refresh" @clear="clear" @remove-item="removeItem" />
    <Actions @add-item="addItem" />
  </section>
  <footer v-if="state.value === 'success'">
    <p>
      Auth:
      <code>{{ keycloaks.auth.tokenParsed || "NULL" }}</code>
    </p>
    <p>
      Guest:
      <code>{{ keycloaks.guest.tokenParsed || "NULL" }}</code>
    </p>
    <button @click="clearGuest" v-if="keycloaks.guest.authenticated">Clear guest</button>
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
section {
  display: flex;
  justify-content: space-evenly;
}
footer {
  position: fixed;
  bottom: 0;
}
</style>
