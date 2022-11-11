<template>
  <v-container
    id="vista"
    fluid
    tag="section"
  >
    <loader-app v-if="loading" />
    <v-row>
      <v-col cols="12" class="pa-4">
        <h4 class="font-weight-bold">
          Documento
        </h4>
        <v-btn @click="getScreenshot">Guardar</v-btn>
      </v-col>
    </v-row>
   <section
      v-if="doc !== null"
      id="header"
    >
      <v-row>
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar
                color="indigo"
                size="40"
              >
                <span
                  class="white--text font-weight-bold text-h5"
                  v-text="doc.propietario.siglas"
                />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" v-text="doc.propietario.nombre" />
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
        <v-col cols="12" class="pl-8 py-2">
          <span
            class="text-h4 font-weight-bold"
            v-text="doc.asunto"
          />
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
  },
  data: () => ({
    doc: null,
    today: new Date(),
    departamentos: [],
    loading: false,
    destinatario: {},
    copias: [],

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
        const { enviados, dpto_copias, ...dataDoc } = await viewDocument({ id: this.id, estatus: 'enviado' })
        this.doc = { ...dataDoc }
        this.destinatario = dataDoc.tipo_documento === 'circular'
          ? enviados
          : enviados.filter(item => item.id === this.infoDepart.id)[0]
        this.copias = dpto_copias
        this.doc.nro_documento = this.doc.nro_documento.toString().padStart(4, '0')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async getScreenshot () {
      try {
        await screenshot({
          id: 'pageDocument',
          title: 'Documento',
          width: '8.5in',
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
}
// E2E7F1
</script>

