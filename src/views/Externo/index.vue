<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0 pb-4" align="center">
      <v-col cols="12" md="8" class="pb-0">
        <span class="text-h4 font-weight-bold">Documentos Externos</span>
      </v-col>
      <v-col cols="12" md="4" class="pb-0">
        <search-expand v-model="search" />
      </v-col>
    </v-row>
    <v-row class="ma-0">
      <v-col cols="12" class="py-0 d-flex align-center justify-space-between">
        <v-tabs style="width: auto;" height="30" class="pt-3">
          <v-tab :ripple="false" @click="assignFilter('')"><strong>Todos</strong>({{data.length}})</v-tab>
          <v-tab :ripple="false" @click="assignFilter('FUNC')">
            <v-icon color="info">mdi-circle-medium</v-icon>
           <strong>Funcionario</strong>({{cantFuncionari}})
          </v-tab>
          <v-tab :ripple="false" @click="assignFilter('PA-IN')">
            <v-icon color="tertiary">mdi-circle-medium</v-icon>
           <strong>Particular/Institucion</strong>({{cantParticular}})
          </v-tab>
        </v-tabs>
        <div class="d-flex align-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                depressed
                color="blue-grey"
                v-bind="attrs"
                v-on="on"
                @click="getBandejaRecibidos(true)"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Actualizar</span>
          </v-tooltip>
          <v-pagination
            class="header-pagination"
            v-model="page"
            :length="pageCount"
            circle
            total-visible="0"
          ></v-pagination>
          <span class="text-pagination" v-text="paginationText" />
        </div>
      </v-col>
      <v-col cols="12" class="pt-0 px-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
          <!-- :item-class="setColorRow" -->
        <v-data-table
          sort-by="fecha_entrada"
          class="inbox"
          hide-default-footer
          :search="search"
          :headers="headers"
          :items="itemsData"
          :loading="loading"
          :sort-desc="true"
          :page.sync="page"
          @page-count="pageCount = $event"
          @pagination="infoPagination = $event"
          @click:row="viewDocumento"
          >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center ml-3">
              <v-icon
                size="19"
                class="mx-2"
                :color="item.importante !== null && item.importante === 1 ? 'red' : 'grey lighten-2'"
                v-text="item.importante !== null && item.importante === 1 ? 'mdi-pin mdi-rotate-45' : 'mdi-pin-outline mdi-rotate-45'"
              />
            </div>
          </template>
           <template v-slot:item.remitente="{ item }">
            <span
              class="text-capitalize font-weight-medium d-flex"
               v-text="item.remitente"
            />
           </template>
           <template v-slot:item.estatus="{ item }">
              <v-chip
                class="ma-2 pa-3 white--text font-weight-medium"
                x-small
                v-if="Boolean(item.requiere_respuesta)"
                :color="setColorStatus(item.estatus)"
                v-text="item.estatus"
              />
           </template>
          <template v-slot:item.asunto="{ item }">
            <div class="d-flex align-center">
              <v-icon class="pt-1" :color="colorTipo[item.tipo]">mdi-circle-medium</v-icon>
              <span
                style="width:25rem"
                class="d-inline-flex text-truncate font-weight-light grey--text"
                :class="{'font-weight-bold': item.leido !== null && item.leido === 0}"
                v-text="item.asunto"
              />
            </div>
          </template>
           <template v-slot:item.fecha_entrada="{ item }">
            <div class="d-flex justify-end" style="width:100px">
              <v-icon v-if="item.anexos > 0" size="19" class="mx-2" color="grey">mdi-paperclip</v-icon>
              <span
                class="grey--text font-weight-normal"
                :class="{'font-weight-bold': item.leido !== null && item.leido === 0}"
              >
                {{ item.fecha_entrada | smartDate }}
              </span>
            </div>
           </template>
           <template v-slot:no-data>
            <v-row>
              <v-col cols="12" class="d-flex flex-column justify-center align-center pa-12">
                <v-img
                  :src="require('@/assets/Icons/ICONO_RECIBIDOS.png')"
                  max-width="300"
                  style="opacity: .7;"
                />
                <span class="text-h5 font-weight-bold blue-grey--text">No tiene Documentos Externos registrados.</span>
              </v-col>
            </v-row>
           </template>
        </v-data-table>
      </v-col>
      <v-col v-if="data.length > 0" cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { getBandeja, bandeja } from '@/services/bandejas'
import { Base64 } from 'js-base64';
export default {
  name: 'Recibidos',
  data: () => ({
    loading: false,
    updating: false,
    headers: [
      // { text: '', value: 'data-table-select', width: '40px' },
      { text: '', value: 'iconos', align: ' px-0', width: '60px' },
      { text: '', value: 'remitente' },
      { text: '', value: 'asunto', align: '' },
      { text: '', value: 'estatus', align: ' px-0', width: '60px' },
      { text: '', value: 'contenido', align: ' d-none' },
      { text: '', value: 'fecha_entrada' },
    ],
    data: [],
    colorTipo: {
      'PA-IN': 'tertiary',
      'FUNC': 'info'
    },
    filterData: '',
    search: '',
    page: 1,
    pageCount: 0,
    infoPagination: {
      pageStart: 0,
      pageStop: 0,
      itemsLength:0,
    }
  }),
  computed: {
    cantFuncionari () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo === 'FUNC').length
        : 0
    },
    cantParticular () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo === 'PA-IN').length
        : 0
    },
    itemsData () {
      return this.data.filter(item => item?.tipo?.includes(this.filterData))
    },
    paginationText () {

      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''

    }
  },
  created () {
    this.getBandejaRecibidos()
  },
  methods: {
    async getBandejaRecibidos (actualizar=false) {
      if(actualizar) this.updating = true
      this.loading = true
      try {
        const { documentos = [] } = await getBandeja({ bandeja: 'externos' })
        this.data = documentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        if(actualizar) this.updating = false
      }
    },
    viewDocumento (row) {
      this.$router.push({ name: 'Externo', params: { id: Base64.encodeURI(row.id) } })
    },
    assignFilter(filter) {
      this.filterData = filter
    },
    setColorRow(item) {
      const NOT_READED = item.leido === 0
      return NOT_READED ? 'unread' : ''
    },
    setColorStatus(status) {

      const textStatus = status.toLowerCase().split(" ").join('-');
      const COLORS = {
        "en-proceso": 'amber darken-2',
        "tramitado": 'teal darken-1'
      }
      return COLORS[textStatus] ?? 'light-blue darken-2'
    }
  },
}
</script>
<style>
.at {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    min-width: 0;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    overflow: visible;
    white-space: nowrap;
    vertical-align: middle;
    align-items: center;
}
</style>
