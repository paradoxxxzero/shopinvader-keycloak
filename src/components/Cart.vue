<script setup>
const items = [{ name: "product1", price: 10 }, { name: "product2", price: 20 }]

const props = defineProps({
  websiteKey: String,
  websiteUrl: String,
  token: String,
})

let cart = []

const fetchCart = async () => {
  const response = await fetch(props.websiteUrl + "cart/", {
    method: "GET",
    headers: {
      "Website-Unique-Key": props.websiteKey,
      "Authorization": `Bearer ${props.token}`,
    }
  })


  if (response.status !== 200) {
    console.error("Fail to fetch cart", response)
  } else {
    cart = await response.json()
    console.log(cart)
  }
}
fetchCart()
</script>

<template>
  <article>
    <h2>Cart</h2>
    <ul>
      <li v-for="item in items" :key="item.name">{{ item.name }}: {{ item.price }}$</li>
    </ul>
    <button @click="fetchCart">Refresh</button>
  </article>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
