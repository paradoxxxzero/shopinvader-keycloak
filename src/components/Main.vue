<script setup>
import User from './User.vue'
import Cart from './Cart.vue'
import Actions from './Actions.vue'
</script>

<template>
  <main>
    <header>
      <User />
    </header>
    <section>
      <Cart />
      <Actions />
    </section>
  </main>
</template>

<style scoped>
section {
  display: flex;
  justify-content: space-evenly;
}
</style>
