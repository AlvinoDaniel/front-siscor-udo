<template>
  <v-main>
    <v-container
      fluid
      class="pa-0"
    >
      <v-scroll-x-transition>
        <router-view :key="$route.path" />
      </v-scroll-x-transition>
    </v-container>
  </v-main>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultView',
    computed: {
      gutters: get('app/gutters'),
    },
  }
</script>
