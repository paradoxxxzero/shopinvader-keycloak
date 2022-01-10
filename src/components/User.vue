<script setup>
import { computed, ref } from "@vue/reactivity";

const address = ref("")

const anonymousUser = {
  name: "Anonymous",
  email: "",
  email_verified: false,
  preferred_username: "anon"
}

const {
  user: userFromToken
} = defineProps({
  user: Object,
  registering: Boolean,
})

const user = computed(() => {
  return userFromToken || anonymousUser
})

const submit = () => {
  console.log("submit", address.value)
  // user creation in shopinvader
  location.replace("/")
}

</script>

<template>
  <aside>
    <h2>User</h2>
    <p>{{ user.preferred_username }} ({{ user.name }})</p>
    <p v-if="user.email">{{ user.email }}</p>
    <form v-if="registering" @submit="submit">
      <input v-model="address" placeholder="address" />
      <button type="submit">Register</button>
    </form>
  </aside>
</template>

<style scoped>
p {
  color: #0a5659;
}
</style>
