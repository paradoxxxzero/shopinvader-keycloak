<script setup>
import { computed } from '@vue/reactivity';
import Debug from './Debug.vue';


const { customerService, registering } = defineProps({
  customerService: Object,
  registering: Boolean
})

if (registering) {
  customerService.setupRegisteringUser()
}


const logout = () => {
  customerService.logout("user")
}

const user = computed(() => customerService.user.value)
const submit = async e => {
  e.preventDefault()

  if (await customerService.register()) {
    location.replace('/')
  }
}

const emit = defineEmits(["login", "register", "refresh"])

emit("refresh")

</script>

<template>
  <aside>
    <h2>User</h2>
    <p v-if="user.email">{{ user.email }}</p>
    <p v-if="customerService.isGuest" :title="customerService.email">Guest</p>
    <Debug :keycloaks="customerService.keycloaks" :user="user" />

    <form v-if="customerService.isUser" @submit="submit">
      <fieldset :disabled="!registering">
        <label>
          Name
          <input v-model="user.name" placeholder="Name" />
        </label>
        <label>
          Street
          <input v-model="user.street" placeholder="Street" />
        </label>
        <label>
          Zip
          <input v-model="user.zip" placeholder="Zip" />
        </label>
        <label>
          City
          <input v-model="user.city" placeholder="City" />
        </label>
        <button v-if="registering" type="submit">Register</button>
      </fieldset>
    </form>
    <div v-if="!registering">
      <button type="button" @click="$emit('refresh')">Refresh</button>
      <button v-if="customerService.isGuest" @click="$emit('login')">Login</button>
      <button v-if="!customerService.isGuest" @click="logout">Logout</button>
      <button v-if="customerService.isGuest" @click="$emit('register')">Register</button>
    </div>
  </aside>
</template>

<style scoped>
aside {
  margin: 16px;
}

p {
  color: #0a5659;
}
fieldset {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 500px;
  margin: 8px auto;
  border: none;
}
fieldset label {
  margin: 8px;
}
fieldset button {
  margin: 8px auto;
}
fieldset[disabled] input {
  border: none;
}
</style>
