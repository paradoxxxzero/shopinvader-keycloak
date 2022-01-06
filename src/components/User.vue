<script setup>
import { computed } from "@vue/reactivity";


const anonymousUser = {
  name: "Anonymous",
  email: "",
  email_verified: false,
  preferred_username: "anon"
}

const props = defineProps({
  authUser: Object,
})

const user = computed(() => {
  return props.authUser || anonymousUser;
});

</script>

<template>
  <aside>
    <h2>User</h2>
    <p>{{ user.preferred_username }} ({{ user.name }})</p>
    <p v-if="user.email">{{ user.email }}</p>
  </aside>
</template>

<style scoped>
p {
  color: #0a5659;
}
</style>
