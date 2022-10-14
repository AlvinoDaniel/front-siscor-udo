<template>
  <v-btn
    class="ml-2"
    min-width="0"
    icon
    to="/"
    exact
    :small="$vuetify.breakpoint.mobile"
  >
    <v-icon>mdi-view-dashboard</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'DefaultGoHome',
  }
</script>
