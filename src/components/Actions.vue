<script setup>
import { ref } from "@vue/reactivity"
import { e } from "../../dist/assets/vendor.11151e81";

const productId = ref(1)
const qty = ref(1)

const emit = defineEmits(["add-item"])

const addProduct = e => {
  emit('add-item', {
    productId: productId.value,
    qty: qty.value,
  })
  e.preventDefault()
}

</script>

<template>
  <article>
    <h2>Actions</h2>
    <div>
      <form @submit="addProduct">
        <input v-model="productId" type="number" placeholder="product id" />
        <input v-model="qty" type="number" placeholder="qty" />
        <button type="submit">Add product</button>
      </form>
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
form {
  display: flex;
  flex-direction: column;
}
</style>
