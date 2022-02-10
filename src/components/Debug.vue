<script setup>
import { ref, watch } from 'vue';

const { keycloaks } = defineProps({
  keycloaks: Object,
  user: Object
})

const debug = ref(localStorage.getItem("__token_debug__") === "true")

watch(debug, (newValue) => {
  localStorage.setItem("__token_debug__", newValue)
})

const clearGuest = () => {
  // After logout we redirect to main page
  keycloaks.guest.logout()
}

</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :fill="debug ? '#f00' : '#000'"
    @click="debug = !debug"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"
    />
  </svg>
  <data v-if="debug">
    <div>
      User:
      <code
        :title="JSON.stringify(keycloaks.user.tokenParsed)"
      >{{ keycloaks.user.tokenParsed?.email || "NULL" }}</code>
    </div>
    <div>
      Guest:
      <code
        :title="JSON.stringify(keycloaks.guest.tokenParsed)"
      >{{ keycloaks.guest.tokenParsed?.email || "NULL" }}</code>
    </div>
    <button @click="clearGuest" v-if="keycloaks.guest.authenticated">Clear guest</button>
  </data>
</template>

<style scoped>
svg {
  position: fixed;
  top: 0;
  right: 0;
  width: 32px;
  cursor: pointer;
}
svg:hover {
  filter: opacity(0.5);
}
data {
  position: fixed;
  top: 16px;
  left: 0;
  width: calc(100% - 32px);
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
