<script setup>
import { computed } from "@vue/reactivity"


const { cartService } = defineProps({
  cartService: Object,
})


const cart = computed(() => cartService.cart.value)
const emit = defineEmits(["remove-item", "refresh", "clear"])

emit("refresh")
</script>

<template>
  <article>
    <h2>Cart</h2>
    <ul>
      <li v-for="item in cart.lines.items" :key="item.id">
        {{ item.name }}: {{ item.qty }} x {{ item.amount.price }}$
        <button
          @click="$emit('remove-item', item.id)"
        >X</button>
      </li>
      <li>Total: {{ cart.amount.total }}$</li>
    </ul>
    <button @click="$emit('refresh')">Refresh</button>
    <button @click="$emit('clear')">Clear</button>
  </article>
</template>

<style scoped>
a {
  color: #42b983;
}
li {
  margin: 16px;
  padding: 4px;
  list-style: none;
  background: #fff8f8;
}
</style>
