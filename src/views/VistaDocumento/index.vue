<template>
  <v-container
    id="vista"
    fluid
    tag="section"
    class="px-8"
  >
    <loader-app v-if="loading" />
    <section
    v-if="doc !== null"
    id="header"
    >
      <v-row align="center">
        <v-col cols="10" class="pb-1 d-flex">
          <span class="text-h4 font-weight-bold primary--text" v-text="doc.asunto" />          
        </v-col>
        <v-col cols="2" class="pb-1 d-flex justify-end">
          <v-btn
            icon
            color="label"
            @click="getScreenshot"
          >
          <!-- mdi-image-plus mdi-camera-plus -->
            <v-icon>mdi-image-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            color="label"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-list-item class="px-0">
            <v-list-item-avatar>
              <v-avatar
                color="indigo"
                size="40"
              >
                <span
                  class="white--text font-weight-bold text-4"
                  v-text="doc.propietario.siglas"
                />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                <span v-text="doc.propietario.nombre" />                
                <v-chip
                  class="mx-2 text-uppercase"
                  color="success"
                  small
                  outlined
                  v-text="doc.tipo_documento"
                />
              </v-list-item-title>
              <v-list-item-subtitle v-text="doc.propietario.jefe.nombres_apellidos" />
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex align-center justify-end pr-6"
        >
         <span class="text-subtitle-1">{{ doc.fecha_enviado | FullDate }}</span>
        </v-col>
        <!-- <v-col cols="12" class="pl-8 py-2">
          <span
            class="text-h4 font-weight-bold"
            v-text="doc.asunto"
          />
        </v-col> -->
        <v-col v-if="this.anexos.length > 0" cols="12" class="py-2">
          <div class="d-blok text-subtitle label-text pl-2 pb-1">
            <v-icon small color="label">mdi-file</v-icon>
            Anexos
          </div>
          <list-anexos-descarga :anexos="anexos" />
        </v-col>
        <v-col cols="12">
          <document :data-doc="doc" :destinatario="destinatario" />
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>
<script>
  import { get } from 'vuex-pathify'
  import { viewDocument } from '@/services/documento'
  import { screenshot } from '@/util/CaptureData'

export default {
  name: 'Documento',
  components: {
    Document: () => import(
      /* webpackChunkName: "document" */
      '@/widgets/Document'
    ),
    ListAnexosDescarga: () => import(
      /* webpackChunkName: "list-anexos-descarga" */
      '@/widgets/ListAnexosDescarga.vue'
    ),
  },
  data: () => ({
    doc: null,
    today: new Date(),
    departamentos: [],
    loading: false,
    destinatario: {},
    copias: [],
    anexos: [],

  }),
  computed: {
    id: get('route/params@id'),
    infoDepart: get('user/departamento'),
  },
  created () {
    this.getDocumento()
  },
  methods: {
    async getDocumento () {
      this.loading = true
      try {
        const { enviados, dpto_copias, anexos, ...dataDoc } = await viewDocument({ id: this.id, estatus: 'enviado' })
        this.doc = { ...dataDoc }
        this.destinatario = dataDoc.tipo_documento === 'circular'
          ? enviados
          : enviados.filter(item => item.id === this.infoDepart.id)[0]
        this.copias = dpto_copias
        this.doc.nro_documento = this.doc.nro_documento.toString().padStart(4, '0')
        this.anexos = anexos.map(item => {
          return {
            file: item,
            loader:false
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async getScreenshot () {
      const page = document.getElementById('pageDocument')
      page.classList.remove('page-shadow')
      try {
        await screenshot({
          id: 'pageDocument',
          title: 'Documento',
          width: '8.5in',
        })
      } catch (error) {
        console.log(error)
      } finally {
        page.classList.add('page-shadow')
      }
    },

    downloadAnexo (index) {
      this.anexos[index].loader = true
    }
  },
}
// E2E7F1
</script>
<style>
.chip-label-tipo {
  min-width: 90px;
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>