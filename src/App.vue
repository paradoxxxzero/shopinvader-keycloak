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
  state: Object
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

const refreshCustomer = customer.get.bind(customer)

const refresh = cart.get.bind(cart)
const addItem = cart.addItem.bind(cart)
const removeItem = cart.removeItem.bind(cart)
const clear = cart.clear.bind(cart)

</script>

<template>
  <Logo :state="state.value" />
  <User
    v-if="state.value === 'success'"
    :customerService="customer"
    :registering="registering"
    @login="login"
    @logout="logout"
    @register="register"
    @refresh="refreshCustomer"
  />
  <section v-if="!registering && state.value === 'success'">
    <Cart :cartService="cart" @refresh="refresh" @clear="clear" @remove-item="removeItem" />
    <Actions @add-item="addItem" />
  </section>
  <footer v-if="state.value === 'success'">
    <div>
      Auth:
      <code
        :title="JSON.stringify(keycloaks.auth.tokenParsed)"
      >{{ keycloaks.auth.tokenParsed?.email || "NULL" }}</code>
    </div>
    <div>
      Guest:
      <code
        :title="JSON.stringify(keycloaks.guest.tokenParsed)"
      >{{ keycloaks.guest.tokenParsed?.email || "NULL" }}</code>
    </div>
    <button @click="clearGuest" v-if="keycloaks.guest.authenticated">Clear guest</button>
  </footer>
</template>

<style>
html,
body,
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
}
section {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  min-height: 0;
  width: 100%;
}
footer {
  margin: 16px 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>
