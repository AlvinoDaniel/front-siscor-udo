<template>
    <div>
      <v-app-bar
        app
        absolute
        color="white"
        elevation="1"
      >
        <v-toolbar-title>
          <v-img
            :src="
              require('@/assets/Logos/IDENTIDAD_1.png')"
            width="250"
          />
        </v-toolbar-title>
  
        <v-spacer></v-spacer>
  
       <v-toolbar-title>
          <v-img
            :src="
              require('@/assets/Logos/Logo_UDO.png')"
            width="50"
          />
        </v-toolbar-title>
      </v-app-bar>
      <v-main class="d-flex justify-center align-center blue-grey lighten-5 full-height">
        <v-container
          fluid
        >
            <router-view :key="$route.path" />
        </v-container>
      </v-main>
    </div>
  </template>
  <script>
  export default {
    name: 'LayoutAuth',
  
  }
  </script>
  <style lang="sass">
    .v-card.v-card--material
      > .v-card__title
        > .v-card--material__title
          flex: 1 1 auto
          word-break: break-word
    .full-height
      height: 100vh
  </style>