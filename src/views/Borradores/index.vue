<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <v-row class="ma-0">
      <v-col cols="12" class="pa-4">
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
    </v-row>
    <v-row>
      <v-col cols="12">
          <!-- :search="search"
          :loading="loadingData" -->
        <v-data-table
          :headers="headers"
          :items="itemsData"
          :loading="loading"
          single-select
          show-select
          class="inbox"
          @click:row="updateDocumento"
        >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center">
              <v-icon
                size="19"
                class="mx-2"
                :color="'grey lighten-2'"
                v-text="'mdi-text-box'"
              />
              <!-- <v-icon
                size="19"
                class="mx-2"
                :color="'grey lighten-2'"
                v-text="'mdi-check-outline'"
              /> -->
            </div>
          </template>
           <template v-slot:item.enviados="{ item }">
            <div v-for="(dpto,i) in item.enviados" :key="i+'-BB'">
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
    },
    filterData: ''
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
    }
  },
  created () {
    this.getBandejaBorradores()
  },
  methods: {
    async getBandejaBorradores () {
      this.loading = true
      try {
        const { documentos } = await getBandeja({ bandeja: 'borradores' })
        this.data = documentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    updateDocumento (row) {
      this.$router.push({ path: `/redactar/${ row.id }` })
      // this.$router.push({ path: '/documento', params: { id: row.id } })
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
