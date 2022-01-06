<script setup>

const props = defineProps({
  auth: Boolean,
})

</script>

<template>
  <article>
    <h2>Actions</h2>
    <div>
      <button v-if="auth">Add product</button>
      <button v-if="!auth" @click="$emit('login')">Login</button>
      <button v-if="auth" @click="$emit('logout')">Logout</button>
      <button v-if="!auth" @click="$emit('signup')">Sign up</button>
    </div>
  </article>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
}

button {
  margin: 8px;
  color: #42b983;
}
</style>
