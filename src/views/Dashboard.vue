<template>
  <v-container
    id="dashboard-view"
    fluid
    tag="section"
    class="py-0"
    :class="{'px-12': $vuetify.breakpoint.xlOnly, 'px-3': $vuetify.breakpoint.mdAndUp}"
  >
    <v-overlay 
      v-if="load"
      :value="true"
      color="white" 
      absolute
      opacity="1"
      key="DashboardOverlay"
      style="z-index: 2 !important"  
    >
      <div class="d-flex flex-column justify-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
          class="mx-auto"      
        ></v-progress-circular>
        <span class="primary--text py-5">Obteniendo Dashboard</span>
      </div>
    </v-overlay>
    <header>
      <v-row class="py-3">
        <v-col cols="12" class="d-flex flex-row align-center">
          <v-avatar 
            color="green" 
            rounded 
            size="60" 
            class="mx-3 elevation-1"
          >
            <v-img height="44" contain :src="require('@/assets/IF.svg')" />
          </v-avatar>
          <div class="d-flex flex-column">
            <span
              class="font-weight-medium primary--text"
              :class="{'text-h3': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly }"
            >
              Bienvenido, {{user.username}}
            </span>
            <span 
              class="blue-grey--text subtitle-2" 
              v-text="now" 
            />
          </div>
        </v-col>
      </v-row>
    </header>
    <section>
      <v-row class="py-3">
        <v-col cols="12">
          <span class="primary--text text-h4 font-weight-medium ml-2">Contadores del día</span>
        </v-col>
        <v-col cols="6" sm="3" class="px-md-5">
          <contador
            color="orange lighten-2" 
            icon="mdi-package-variant-closed"
            color-icon="orange" 
            label="Cajas Pre-vendidas"
            :count="contadoresDia.cantidad_cajas"
          />
        </v-col>
        <v-col cols="6" sm="3" class="px-md-5">
          <contador
            color="indigo lighten-1"
            icon="mdi-briefcase-outline"
            color-icon="indigo"
            label="Pedidos"
            :count="contadoresDia.cantidad_pedidos"
          />
        </v-col>
        <v-col cols="6" sm="3" class="px-md-5">
          <contador
            color="light-blue lighten-3"
            icon="mdi-text-box-check-outline"
            color-icon="blue"
            label="Cobros"
            :count="contadoresDia.cobros_realizados"
          />
        </v-col>
        <v-col cols="6" sm="3" class="px-md-5">
          <contador
            color="icono"
            icon="mdi-currency-usd"
            color-icon="teal"
            label="Saldo Cobrado"
            :count="contadoresDia.saldo_cobrado"
          />
        </v-col>
      </v-row>
    </section>

    <section>
      <v-row class="pa-md-3 mb-4">
        <v-col cols="12">
          <v-card flat tile :loading="capturing">
            <v-card-text id="CuentasPorCobrar">
              <header-screenshot
                v-show="capturing"                
              />
              <v-row class="py-3">
                <v-col
                  cols="12"
                  class="d-flex justify-space-between"
                >
                <div class="d-flex flex-column">
                  <!-- <img
                    :src="require('@/assets/Logos/anzoategui.png')"
                    width="150"
                    class="ml-2 mb-2"
                  > -->
                  <span
                    class="primary--text font-weight-bold ml-2"
                    :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h6': $vuetify.breakpoint.xsOnly }"
                  >Consolidado de Cuentas por Cobrar</span>
                </div>
                  <v-btn
                    id="btnCapture"
                    color="primary"
                    dark
                    small
                    class="ml-2 py-0"
                    :class="{'px-2': $vuetify.breakpoint.smAndDown}"
                    @click="converCuentasToImage"
                  >               
                    <v-icon 
                      size="22" 
                      :left="$vuetify.breakpoint.mdAndUp" 
                      v-text="'mdi-camera-plus-outline'"
                    />             
                    <span v-if="$vuetify.breakpoint.smAndUp">Capturar</span>          
                  </v-btn>      
                </v-col>
               <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  class="d-flex flex-column pt-1 justify-end white"
                >
                  <span class="text-h2 font-weight-black primary--text pb-0 d-flex align-center">
                    <v-icon color="primary" large>mdi-currency-usd</v-icon>
                    {{saldoVencido.Total | FormatCurrency}}
                  </span>
                  <span class="blue-grey--text text--lighten-1 font-italic caption pl-8 mt-n3">Total Cuentas por Cobrar</span>
                  <div v-if="$vuetify.breakpoint.mdAndUp" class="fill-height d-flex align-end white">
                    <v-list dense class="mb-3 white">
                      <v-list-item v-for="(legend,i) in legends" :key="'graficaLegend'+i" class="white">
                        <v-list-item-icon class="mr-1">
                          <v-icon :color="legend.color">mdi-checkbox-blank</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="legend.text" />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
                <v-col cols="12" sm="12" md="8" class="px-md-12">
                  <deudas-grafica
                    :datos="saldoVencido"
                    tipo="bar" 
                  />               
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- <visitas /> -->
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'
  import moment from 'moment'
  import { screenshot } from '@/util/CaptureData'

  export default {
    name: 'DashboardView',
    components: { 
      // Visitas: () => import(
      //   /* webpackChunkName: "visitas" */
      //   './Dashboard/Visitas.vue'
      // ),
      // CxcClientes: () => import(
      //   /* webpackChunkName: "cxc-clientes" */
      //   './Dashboard/CxcClientes.vue'
      // ),
      DeudasGrafica: () => import(
        /* webpackChunkName: "deudas-grafica" */
        './Dashboard/DeudasGrafica.vue'
      ),
      Contador: () => import(
        /* webpackChunkName: "contador" */
        './Dashboard/Contador.vue'
      ),
    },
    data: () => ({
      load: false,
      dataDashboard: '',
      saldoVencido: {},
      contadoresDia: {
        cantidad_cajas: 0,
        cantidad_pedidos: 0,
        cobros_realizados: 0,
        saldo_cobrado: 0,
      },
      capturing: false,
    }),
    computed: {
      user: get('user/infoBasic'),
      basic: get('user/infoBasic'),
      LOGO () {
        const URL_API = "http://apidev.isolafoods.com/"
        return URL_API + this.basic.logo
      },
      now () {
        moment.locale('es')
        return moment().format("DD MMMM, YYYY")
      },
      legends () {
        const label = this.saldoVencido.data ? Object.keys(this.saldoVencido.data) : []
        const colors = ['#4A148C', '#009688', '#FF5722', '#E91E63', '#FFD600']

        return label.length 
          ? label.map((item, key) => ({
            text: item,
            color: colors[key]
          }))
          : []
      },
      totalSaldoCobrado() {
        var numberFormat = new Intl.NumberFormat('es-ES');
        return this.contadoresDia.saldo_cobrado 
          ? numberFormat.format(this.contadoresDia.saldo_cobrado) 
          : 0
      },
    },
    created () {
      this.getDashboard()
    },   
    methods: {
      async getDashboard () {
        this.load = true
        try {
          const { data } = await this.$api.get('dashboard/inicio')
          this.saldoVencido = data.saldo_vencido
          this.contadoresDia = data.contadores_por_dia          
        } catch (error) {
          this.$root.$showAlert(
            'Lo siento, hubo un error al intentar obtener los Pagos.',
            'error',
          )
        }
        this.load = false
      },
      async converCuentasToImage () {
        this.capturing = true
        const btn = document.getElementById('btnCapture')
        const ID_ELEMENT = 'CuentasPorCobrar' 
        const NAME_IMAGE = 'Capture_consolidado_cuentas_por_cobrar'
        try {
          btn.classList.add("d-none")
          // await wait(125)
          await screenshot({ id: ID_ELEMENT, title: NAME_IMAGE, width: this.$vuetify.breakpoint.xsOnly ? 500 : null })
          btn.classList.remove("d-none")
          this.$root.$showAlert(
            'Capture Exitoso, espere la descarga.',
            'success'
          )              
        } catch (error) {
          this.$root.$showAlert(
            'Lo siento, hubo un error al intentar capturar el Reporte.',
            'error',
          )
        } finally {
          this.capturing = false
        }
      },
    }
  }
</script>
<style lang="sass">
.cliente-titulo
    font-size: 0.9rem !important
    font-weight: 500
    line-height: 1.5em
    letter-spacing: 0.0125em !important
    font-family: "Open Sans" !important
    text-transform: uppercase !important

</style>