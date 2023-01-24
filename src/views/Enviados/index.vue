<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12" sm="7" md="6" class="pt-1">
        <v-tabs>
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
      </v-col>
      <v-col cols="12" sm="5" md="6" class="pt-1 d-flex align-center justify-end">
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
          <!-- :search="search"
          :loading="loadingData" -->
          <!-- single-select
          show-select -->
        <v-data-table
          :headers="headers"
          :items="itemsData"
          :loading="loading"
          no-data-text="No hay Documentos Enviados"
          sort-by="fecha_enviado"
          hide-default-footer
          :sort-desc="true"
          class="inbox"
          :page.sync="page"
          @page-count="pageCount = $event"
          @pagination="infoPagination = $event"
          @click:row="viewDocumento"
          >
          <template v-slot:item.iconos="{ item }">
            <viewed-copy :enviados="item.enviados" :copias="item.dpto_copias" />
          </template>
           <template v-slot:item.enviados="{ item }">
            <div>
              <span>{{item.enviados[0].nombre}}</span>
              <v-chip v-if="item.enviados.length > 1" x-small color="blue-grey lighten-4" class="px-1 font-weight-bold ml-1" label>+{{item.enviados.length - 1}}</v-chip>
            </div>
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
                v-text="item.asunto"
              />
            </div>
          </template>
           <template v-slot:item.fecha_enviado="{ item }">
            <div class="d-flex justify-end ">
              <v-icon v-if="item.anexos > 0" size="19" class="mx-2" color="grey">mdi-paperclip</v-icon>
              <span class="grey--text font-weight-normal">
                {{ item.fecha_enviado | shortDate }}
              </span>
            </div>
           </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { getBandeja } from '@/services/bandejas'
import { Base64 } from 'js-base64';
export default {
  name: 'Enviados',
  components: {
    ViewedCopy: () => import(
      /* webpackChunkName: "viewed-copy" */
      '@/widgets/ViewedCopy.vue'
    ),
  },
  data: () => ({
    loading: false,
    headers: [
      // { text: '', value: 'data-table-select', width: '40px' },
      { text: '', value: 'iconos', align: ' px-0', width: '60px' },
      { text: '', value: 'enviados', align: ' pr-0'},
      { text: '', value: 'asunto', align: '' },
      { text: '', value: 'fecha_enviado', width: '100' },
    ],
    data: [],
    colorTipo: {
      circular: 'tertiary',
      oficio: 'info'
    },
    filterData: '',
    updating: false,
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
  },
  methods: {
    async getBandejaRecibidos (actualizar=false) {
      if(actualizar) this.updating = true
      this.loading = true
      try {
        const { documentos } = await getBandeja({ bandeja: 'enviados' })
        this.data = documentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        if(actualizar) this.updating = false
      }
    },
    viewDocumento (row) {
      // this.$router.push({ path: `/documento/${ row.id }` })
      this.$router.push({ name: 'Documento', params: { id: Base64.encodeURI(row.id) }, query: {tab: 'enviado'} })
    },
    assignFilter(filter) {
      this.filterData = filter
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
