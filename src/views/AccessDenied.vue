<template>
  <v-container
    id="error-view"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center" align="center" class="fill-height mb-2">
      <v-col cols="12" md="8" class="px-0 text-center">
        <v-img
          :src="require('@/assets/403_1400X800.png')"
        />
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="8">
        <v-row>
          <v-col cols="12" class="py-0">
            <v-chip
            class="mr-2"
            color="blue accent-2"
            dark
          >
            <v-icon left>
              mdi-block-helper
            </v-icon>
            No tiene Permiso
          </v-chip>
          </v-col>
          <v-col cols="12" class="py-0">
            <span 
              class="mb-16 font-weight-bold blue--text text--darken-4"
              :style="styles"
            >
              Acceso Denegado
            </span>
          </v-col>
          <v-col cols="12" class="pt-0">
            <span 
              class="blue-grey--text d-block mb-5"
              :class="{'text-h4': this.$vuetify.breakpoint.mdAndUp, 'text-h5': this.$vuetify.breakpoint.smAndDown}">Su usuario no tiene permiso para realizar esta acción.</span>
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
          'font-size': this.$vuetify.breakpoint.mdAndUp ? '3rem' : this.$vuetify.breakpoint.smOnly ? '4rem' : '2rem',
          'letter-spacing': '-0.3rem',
        }
      }
    }, 
  }
</script>

<style lang="sass">
  #error-view h1.text-h1
    font-size: 14rem !important
</style>
