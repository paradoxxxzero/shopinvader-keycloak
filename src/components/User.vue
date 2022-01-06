<script setup>

const user = { name: "Anonymous" }

</script>

<template>
  <aside>
    <h2>User</h2>
    <p>{{ user.name }}</p>
  </aside>
</template>

<style scoped>
p {
  color: #0a5659;
}
</style>
