<script setup>
import { ref } from "@vue/reactivity"

const productId = ref(null)
const qty = ref(null)

const emit = defineEmits(["add-item"])

const addProduct = () => {
  emit('add-item', {
    productId: productId.value,
    qty: qty.value,
  })
}

</script>

<template>
  <article>
    <h2>Actions</h2>
    <div>
      <form>
        <input v-model="productId" type="number" placeholder="product id" />
        <input v-model="qty" type="number" placeholder="qty" />
        <button type="button" @click="addProduct">Add product</button>
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
