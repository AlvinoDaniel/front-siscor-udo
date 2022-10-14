<template>
  <v-btn
    class="ml-3 mr-4"
    icon
    small
    @click="mini = !mini"
    v-if="mini"
  >
    <v-icon>
      <!-- {{ mini ? 'mdi-format-list-bulleted' : 'mdi-dots-vertical' }} -->
      mdi-menu-open
    </v-icon>
  </v-btn>
</template>

<script>
  // Utilities
  import { sync } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawerToggle',

    computed: {

      mini: sync('app/mini'),
    },
  }
</script>
