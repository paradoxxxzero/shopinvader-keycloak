<script setup>
const items = [{ name: "product1", price: 10 }, { name: "product2", price: 20 }]

</script>

<template>
  <article>
    <h2>Cart</h2>
    <ul>
      <li v-for="item in items" :key="item.name">{{ item.name }}: {{ item.price }}$</li>
    </ul>
  </article>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
