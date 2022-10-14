<template>
  <div>
    <v-overlay :value="overlay" :opacity="1" :z-index="10" color="grey lighten-5" class="text-center">
      <v-img
        contain
        max-width="180"
        :src="require('@/assets/Logos/IDENTIDAD_2.png')"
      ></v-img>        
      <v-progress-linear
          color="blue-grey lighten-2"
          indeterminate
          rounded
          height="4"
          class="mt-2"
        ></v-progress-linear>
      <!-- <h5 class="blue-grey--text mt-2">Cerrando Sesión</h5> -->
    </v-overlay>    
  </div>
</template>
<script>
import { get } from 'vuex-pathify'
export default {
  name: 'DefaultOverlay',

  computed: {
    overlay: get('app/overlay'),
  }
}
</script>