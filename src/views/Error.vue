<template>
  <v-container
    id="error-view"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-col cols="12" sm="4" md="5" class="px-0">
        <v-img
          :src="require('@/assets/404_1400X800.png')"
        />
      </v-col>
      <v-col cols="12" sm="8" md="7">
        <v-row>
          <v-col cols="12" class="py-0">
            <v-chip
            class="mr-2"
            color="blue accent-2"
            dark
          >
            <v-icon left>
              mdi-link-variant-off
            </v-icon>
            Pagina no encontrada
          </v-chip>
          </v-col>
          <v-col cols="12" class="py-0">
            <span 
              class="mb-16 font-weight-bold blue--text text--darken-4"
              :style="styles"
            >
              !OhNo! Error 404
            </span>
          </v-col>
          <v-col cols="10" sm="9" md="9" class="pt-0">
            <span 
              class="blue-grey--text d-block mb-5"
              :class="{'text-h3': this.$vuetify.breakpoint.mdAndUp, 'text-h5': this.$vuetify.breakpoint.smAndDown}">La ruta que deseas ver, no existe. Vuelva a la página Principal.</span>
            <v-btn
              large
              color="blue darken-2"
              dark
              to="/"
            >
              <v-icon left>
              mdi-arrow-left
            </v-icon>
              Ir a Principal
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default { 
    name: 'ErrorView',
    computed: {
      styles() {
        return {
          'font-size': this.$vuetify.breakpoint.mdAndUp ? '5rem' : this.$vuetify.breakpoint.smOnly ? '4rem' : '3rem',
          'letter-spacing': '-0.3rem',
        }
      }
    } 
  }
</script>

<style lang="sass">
  #error-view h1.text-h1
    font-size: 14rem !important
</style>
