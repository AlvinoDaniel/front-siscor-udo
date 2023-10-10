<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12" class="pb-0">
        <span class="text-h4 font-weight-bold">Bandeja de Recibidos</span>
      </v-col>
      <v-col cols="12" class="py-0 d-flex align-center justify-space-between">
        <v-tabs style="width: auto;" height="30" class="pt-3">
          <v-tab :ripple="false" @click="assignFilter('')"><strong>Todos</strong>({{data.length}})</v-tab>
          <v-tab :ripple="false" @click="assignFilter('oficio')">
            <v-icon color="info">mdi-circle-medium</v-icon>
           <strong>Oficio</strong>({{cantOficios}})
          </v-tab>
          <v-tab :ripple="false" @click="assignFilter('circular')">
            <v-icon color="tertiary">mdi-circle-medium</v-icon>
           <strong>Circular</strong>({{cantCopias}})
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
          <!-- :search="search"
          :loading="loadingData" -->
          <!-- no-data-text="No hay Documentos Recibidos" -->
        <v-data-table
          sort-by="fecha_enviado"
          class="inbox"
          hide-default-footer
          :headers="headers"
          :items="itemsData"
          :item-class="setColorRow"
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
                :color="item.copia !== null && item.copia === 1 ? 'yellow darken-1' : 'grey lighten-2'"
                v-text="item.copia !== null && item.copia === 1 ? 'mdi-text-box' : 'mdi-text-box-outline'"
              />
              <v-icon
                size="19"
                class="mx-2"
                :color="item.leido !== null && item.leido === 1 ? 'icono' : 'grey lighten-2'"
                v-text="item.leido !== null && item.leido === 1 ? 'mdi-check-all' : 'mdi-check-outline'"
              />
            </div>
          </template>
           <template v-slot:item.propietario="{ item }">
            <span
              :class="{'font-weight-bold': item.leido !== null && item.leido === 0}"
               v-text="item.propietario.nombre"
            />
           </template>
          <template v-slot:item.asunto="{ item }">
            <div class="d-flex align-center">
              <v-icon :color="colorTipo[item.tipo_documento]">mdi-circle-medium</v-icon>
              <span
                class="font-weight-bold text-uppercase"
                v-text="item.tipo_documento"
              />
              <span class="mx-2">-</span>
              <span
                style="width:30rem"
                class="d-inline-flex text-truncate"
                :class="{'font-weight-bold': item.leido !== null && item.leido === 0}"
                v-text="item.asunto"
              />
            </div>
          </template>
           <template v-slot:item.fecha_enviado="{ item }">
            <div class="d-flex justify-end ">
              <v-icon v-if="item.anexos > 0" size="19" class="mx-2" color="grey">mdi-paperclip</v-icon>
              <span
                class="grey--text font-weight-normal"
                :class="{'font-weight-bold': item.leido !== null && item.leido === 0}"
              >
                {{ item.fecha_enviado | shortDate }}
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
                <span class="text-h5 font-weight-bold blue-grey--text">No tiene Recibidos</span>
              </v-col>
            </v-row>
           </template>
        </v-data-table>
      </v-col>
      <v-col v-if="itemsData.length > 0" cols="12" class="pt-0">
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
      { text: '', value: 'propietario' },
      { text: '', value: 'asunto', align: '' },
      { text: '', value: 'fecha_enviado', width: '100' },
    ],
    data: [],
    colorTipo: {
      circular: 'tertiary',
      oficio: 'info'
    },
    filterData: '',
    page: 1,
    pageCount: 0,
    infoPagination: {
      pageStart: 0,
      pageStop: 0,
      itemsLength:0,
    }
  }),
  computed: {
    cantOficios () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo_documento === 'oficio').length
        : 0
    },
    cantCopias () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo_documento === 'circular').length
        : 0
    },
    itemsData () {
      return this.data.filter(item => item.tipo_documento.includes(this.filterData))
    },
    paginationText () {

      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''

    }
  },
  created () {
    this.getBandejaRecibidos()
    this.getBandejaCount()
  },
  methods: {
    async getBandejaRecibidos (actualizar=false) {
      if(actualizar) this.updating = true
      this.loading = true
      try {
        const { documentos } = await getBandeja({ bandeja: 'recibidos' })
        this.data = documentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        if(actualizar) this.updating = false
      }
    },
    async getBandejaCount() {
      this.loading = true
      try {
        const { documentos } = await bandeja()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    viewDocumento (row) {
      // this.$router.push({ path: `/documento/${ row.id }`, query: {tab: 'recibido'} })
      this.$router.push({ name: 'Documento', params: { id: Base64.encodeURI(row.id) }, query: {tab: 'recibido'} })
    },
    assignFilter(filter) {
      this.filterData = filter
    },
    setColorRow(item) {
      const NOT_READED = item.leido === 0
      return NOT_READED ? 'unread' : ''
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
