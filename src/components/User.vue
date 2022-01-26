<script setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'


const { customerService } = defineProps({
  customerService: Object,
  registering: Boolean
})

const user = computed(() => customerService.user.value)

const emit = defineEmits(["login", "logout", "register"])

const submit = async () => {
  if (await customerService.register()) {
    location.replace('/')
  }
}
</script>

<template>
  <aside>
    <h2>User</h2>

    <p v-if="user.email">{{ user.email }}</p>
    <form v-if="customerService.isAuth">
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
        <button v-if="registering" type="button" @click="submit">Register</button>
      </fieldset>
    </form>
  </aside>
  <div v-if="!registering">
    <button type="button" @click="customerService.get">Refresh</button>
    <button v-if="customerService.isGuest" @click="$emit('login')">Login</button>
    <button v-if="!customerService.isGuest" @click="$emit('logout')">Logout</button>
    <button v-if="customerService.isGuest" @click="$emit('register')">Register</button>
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
