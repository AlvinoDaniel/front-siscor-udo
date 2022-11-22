<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <v-row class="ma-0">
      <v-col cols="12" class="pa-4">
        <h4 class="font-weight-bold">
          Enviados
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
          <!-- :search="search"
          :loading="loadingData" -->
        <v-data-table
          :headers="headers"
          :items="data"
          :loading="loading"
          single-select
          show-select
          sort-by="fecha_enviado"
          :sort-desc="true"
          class="inbox"
          @click:row="viewDocumento"
        >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center">
              <v-icon
                size="19"
                class="mx-2"
                :color="item.dpto_copias.length > 0 ? 'yellow darken-1' : 'grey lighten-2'"
                v-text="item.dpto_copias.length > 0 ? 'mdi-text-box' : 'mdi-text-box-outline'"
              />
              <v-icon
                v-if="item.tipo_documento === 'oficio'"
                size="19"
                class="mx-2"
                :color="item.enviados[0].leido !== null && item.enviados[0].leido === 1 ? 'icono' : 'grey lighten-2'"
                v-text="item.enviados[0].leido !== null && item.enviados[0].leido === 1 ? 'mdi-check-all' : 'mdi-check-outline'"
              />
              <v-icon
                v-if="item.tipo_documento === 'circular'"
                size="19"
                class="mx-2"
                :color="item.enviados[0].leido !== null && item.enviados[0].leido === 1 ? 'icono' : 'grey lighten-2'"
                v-text="item.enviados[0].leido !== null && item.enviados[0].leido === 1 ? 'mdi-check-all' : 'mdi-check-outline'"
              />
            </div>
          </template>
           <template v-slot:item.enviados="{ item }">
            <div v-for="(dpto,i) in item.enviados" :key="i">
              <span>{{dpto.nombre}}</span>
              <span v-if="i < (item.enviados.length - 1)">, </span>
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
              <span class="grey--text font-weight-normal">
                {{ item.fecha_enviado | shortDate }}
              </span>
            </div>
           </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { getBandeja } from '@/services/bandejas'
export default {
  name: 'Recibidos',
  data: () => ({
    loading: false,
    headers: [
      { text: '', value: 'data-table-select', width: '40px' },
      { text: '', value: 'iconos', align: ' px-0', width: '60px' },
      { text: '', value: 'enviados' },
      { text: '', value: 'asunto', align: '' },
      { text: '', value: 'fecha_enviado', width: '100' },
    ],
    data: [],
    colorTipo: {
      circular: 'tertiary',
      oficio: 'info'
    }
  }),
  created () {
    this.getBandejaRecibidos()
  },
  methods: {
    async getBandejaRecibidos () {
      this.loading = true
      try {
        const { documentos } = await getBandeja({ bandeja: 'enviados' })
        this.data = documentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    viewDocumento (row) {
      // this.$router.push({ path: `/documento/${ row.id }` })
      this.$router.push({ name: 'Documento', params: { id: row.id }, query: {tab: 'enviado'} })
    },
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
