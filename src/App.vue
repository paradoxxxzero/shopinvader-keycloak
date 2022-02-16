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

// Use a real router instead
const registering = ref(window.location.pathname == '/register')

// Use a real service
const customer = new CustomerService(keycloaks, registering.value)
const cart = new CartService(keycloaks, customer)

window.cart = cart
window.customer = customer

const refreshCustomer = customer.get.bind(customer)

const refresh = cart.get.bind(cart)
const addItem = cart.addItem.bind(cart)
const removeItem = cart.removeItem.bind(cart)
const clear = cart.clear.bind(cart)
const createCartForCustomer = cart.createForCustomer.bind(cart)

const login = () => {
  // After login we redirect to main page
  keycloaks.user.login()
}

const register = () => {
  // After register we redirect to the registration page of shopinvader
  keycloaks.user.register({
    redirectUri: `${window.location.origin}/register`,
  })
}
</script>

<template>
  <Logo :state="state.value" />
  <User
    v-if="state.value === 'success'"
    :customerService="customer"
    :registering="registering"
    @login="login"
    @register="register"
    @refresh="refreshCustomer"
    @customerChanged="createCartForCustomer"
  />
  <section v-if="!registering && state.value === 'success'">
    <Cart :cartService="cart" @refresh="refresh" @clear="clear" @remove-item="removeItem" />
    <Actions @add-item="addItem" />
  </section>
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
</style>
