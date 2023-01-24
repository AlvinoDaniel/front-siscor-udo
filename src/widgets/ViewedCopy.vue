<template>
  <div class="d-flex justify-center align-center ml-3">
    <v-btn icon  @click.stop="open('copias')">
      <v-icon
        size="19"
        class="mx-2"
        :color="hasCopia ? 'yellow darken-1' : 'grey lighten-2'"
        v-text="hasCopia ? 'mdi-text-box' : 'mdi-text-box-outline'"
        />
    </v-btn>
    <v-btn icon @click.stop="open('enviados')">
        <v-icon
        size="19"
        class="mx-2"
        :color="esLeido ? 'icono' : 'grey lighten-2'"
        v-text="esLeido ? 'mdi-check-all' : 'mdi-check-outline'"
      />
    </v-btn>
    <departaments-tray v-model="showEnviados" :items="enviados" />
  </div>
</template>
<script>
  export default {
    name: 'ViwedCopy',
    components: {
      DepartamentsTray: () => import(
        /* webpackChunkName: "departaments-tray" */
        './DepartamentsTray.vue'
      ),
    },
    props: {
      typeDoc: String,
      enviados: {
        type: Array,
        default: () => ([])
      },
      copias: {
        type: Array,
        default: () => ([])
      },
    },
    data() {
      return {
        showEnviados: false,
        showCopias: false,
      }
    },
    computed: {
      hasCopia() {
        return this.copias.length > 0
      },
      esLeido () {
        return this.enviados.length > 0
          ? this.enviados.every(item => item.leido === 1)
          : false
      },
    },
    methods: {
      open (modal) {
        if(modal === 'enviados')
          this.showEnviados = true

        if(modal === 'copias' && this.hasCopia)
          this.showEnviados = true
      }
    }
  }
</script>
