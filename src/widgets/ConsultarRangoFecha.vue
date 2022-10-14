<template>
<div
  class="d-flex align-center flex-row"
>
  <div>
  </div>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="160"
    :nudge-bottom="10"
    offset-y
    z-index="100"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        label
        outlined
        class="d-flex align-center pr-1"
        :class="{'fill-width d-flex justify-center': $vuetify.breakpoint.xsOnly, }"
        v-on="on"
        v-bind="attrs"
      >
        <v-icon size="20" :left="$vuetify.breakpoint.smAndUp">mdi-calendar</v-icon>
        <span class="font-weight-bold text-h6">
          <template v-if="selected_text !== 'personalizado'">
            <span class="hidden-xs-only">{{selected_text}}:</span>
          </template>
          {{ fecha_inicio | smartDate }} - {{fecha_fin | smartDate }}</span>
          <v-icon
            size="22"
            class="ml-1 pr-0"
            v-text="menu ? 'mdi-menu-up' : 'mdi-menu-down' "
          />
      </v-chip>

      <!-- <v-btn
        color="icono"
        class="ml-2 pr-1"
        outlined
        small
        v-on="on"
        v-bind="attrs"
      >
        <v-icon size="22" :left="!$vuetify.breakpoint.smAndDown">mdi-tune</v-icon>
        <span class="hidden-sm-and-down">Consultar</span>
        <v-icon
          size="22"
          class="ml-1 hidden-sm-and-down"
          v-text="menu ? 'mdi-menu-up' : 'mdi-menu-down' "></v-icon>
      </v-btn> -->
    </template>
    <v-card>
      <v-card-title class="px-4 primary--text display-1 grey lighten-5">
        <v-icon left>mdi-calendar-month</v-icon>
        Seleccione Fecha a consultar
      </v-card-title>
      <v-card-text class="px-4 pt-1 mb-3">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-radio-group class="pt-0" v-model="selected_date" hide-details>
              <v-radio
                v-if="allItems"
                label="Todos"
                value="todos"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Todos</span>
                </template>
              </v-radio>
              <v-radio
                label="Semanal"
                value="semana"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Semana</span>
                </template>
              </v-radio>
              <v-radio
                label="Quincenal"
                value="Quincena"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Quincena</span>
                </template>
              </v-radio>
              <v-radio
                label="Mensual"
                value="Mes"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Mes Actual</span>
                </template>
              </v-radio>
              <v-radio
                label="Trimestre"
                value="Trimestre"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Trimestre</span>
                </template>
              </v-radio>
              <v-radio
                label="Rango de Fecha"
                value="personalizado"
                color="icono"
              >
                <template #label>
                  <span class="blue-grey--text font-weight-medium">Rango de Fecha</span>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12"
            class="d-flex flex-row"
            :class="{'flex-row align-center': $vuetify.breakpoint.smAndUp, 'flex-column ': $vuetify.breakpoint.xsOnly}"
            >
            <div>
              <label-form text="Inicio" required/>
              <fecha-input
                v-model="range_inicio"
                color="blue-grey lighten-5"
                hiddenMsg
                :disabled="selected_date != 'personalizado'"/>
            </div>
            <span class="blue-grey--text font-weight-medium mx-4 mt-3 caption">-</span>
            <div>
              <label-form text="Final" required/>
              <fecha-input
                v-model="range_fin"
                hidden-msg
                color="deep-orange lighten-5"
                :disabled="selected_date != 'personalizado'"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <span v-if="error.active" style="width:200px" class="error--text caption font-italic" v-text="error.msg"></span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="py-3 d-flex justify-center">
        <v-btn
          outlined
          color="blue-grey"
          @click="menu = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="consultarDatos"
          class="pr-3"
        >
          <v-icon left size="22">mdi-magnify</v-icon>
          Consultar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ConsultarRangoFecha',
  components:{
    FechaInput: () => import(
      /* webpackChunkName: "fecha-input" */
      './FechaInput'
    ),
  },
  props:{
    fecha: {
      type: Object,
      default: () => ({
        inicio: '',
        final: '',
      })
    },
    allItems:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      fecha_inicio: '',
      fecha_fin: '',
      range_inicio: moment().format('YYYY-MM-DD'),
      range_fin: moment().format('YYYY-MM-DD'),
      selected_date: 'semana',
      selected_text: 'semana',
      error:{
        active: false,
        msg: ''
      },
      menu: false
    }
  },
  created(){
    this.fecha_inicio = moment().startOf('week').day(1).format("YYYY-MM-DD");
    this.fecha_fin = moment().format('YYYY-MM-DD');
  },
  methods:{
    consultarDatos() {
      this.error ={
        active: false,
        msg: ''
      };
      // this.fecha_fin = '';
      // this.fecha_inicio = '';
      switch (this.selected_date) {
        case 'todos':
          this.fecha_inicio = '';
          this.fecha_fin = '';
          break;
        case 'semana':
          this.fecha_inicio = moment().startOf('week').day(1).format("YYYY-MM-DD");
          this.fecha_fin = moment().format("YYYY-MM-DD");
          break;
        case 'Quincena':
          this.fecha_inicio = moment().subtract(15, 'days').format("YYYY-MM-DD");
          this.fecha_fin = moment().format("YYYY-MM-DD");
          break;
        case 'Mes':
          this.fecha_inicio = moment().startOf('month').format("YYYY-MM-DD");
          this.fecha_fin = moment().format("YYYY-MM-DD");
          break;
        case 'Trimestre':
          this.fecha_inicio = moment().subtract(3, 'months').format("YYYY-MM-DD");
          this.fecha_fin = moment().format("YYYY-MM-DD");
          break;
        case 'personalizado':
          if(moment(this.range_inicio).isSameOrBefore(this.range_fin)){
            this.fecha_inicio = this.range_inicio;
            this.fecha_fin = this.range_fin;
          }
          else{
            this.error ={
              active: true,
              msg: 'La fecha de inicio debe ser menor que la fecha final'
            };
            return;
          }
          break;
        default:
          break;
      }
      this.selected_text = this.selected_date;
      this.menu = false;
      this.$emit('consultar', {ini: this.fecha_inicio, fin: this.fecha_fin});
    }
  },
}
</script>
