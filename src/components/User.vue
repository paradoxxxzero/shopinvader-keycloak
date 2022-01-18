<script setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'


const { user } = defineProps({
  user: Object,
  registering: Boolean
})


const emit = defineEmits(["login", "logout", "register"])

const submit = () => {
  const country = {
    id: 75 // France
  }
  console.log('Register customer', { country, ...user.value })
  // user creation in shopinvader
  location.replace('/')
}
</script>

<template>
  <aside>
    <h2>User</h2>

    <p v-if="user.value.email">{{ user.value.email }}</p>
    <form v-if="!user.value.is_anon">
      <fieldset :disabled="!registering">
        <label>
          Name
          <input v-model="user.value.name" placeholder="Name" />
        </label>
        <label>
          Street
          <input v-model="user.value.street" placeholder="Street" />
        </label>
        <label>
          Zip
          <input v-model="user.value.zip" placeholder="Zip" />
        </label>
        <label>
          City
          <input v-model="user.value.city" placeholder="City" />
        </label>
        <button v-if="registering" type="button" @click="submit">Register</button>
      </fieldset>
    </form>
  </aside>
  <div v-if="!registering">
    <button v-if="user.value.is_anon" @click="$emit('login')">Login</button>
    <button v-if="!user.value.is_anon" @click="$emit('logout')">Logout</button>
    <button v-if="user.value.is_anon" @click="$emit('register')">Register</button>
  </div>
</template>

<style scoped>
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
