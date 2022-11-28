<template>
  <v-container
    id="vista"
    fluid
    tag="section"
    class="px-8"
  >
    <loader-doc v-if="loading" />
    <section
    v-if="doc !== null"
    id="header"
    >
      <v-row align="center">
        <v-col cols="12" class="pb-0 d-flex justify-space-between align-center">
          <v-chip
            class="text-uppercase"
            :color="colorTipo[doc.tipo_documento]"
            small
            outlined
            label
            v-text="doc.tipo_documento"
          />
          <div>
            <v-btn
            icon
            color="label"
            @click="getScreenshot"
          >
          <!-- mdi-image-plus mdi-camera-plus -->
            <v-icon>mdi-camera-plus-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            color="label"
          >
            <v-icon>mdi-file-download-outline</v-icon>
          </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="11" class="pt-0">
          <span class="text-h4 font-weight-bold primary--text d-block" v-text="doc.asunto" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" class="d-flex align-center pb-0">
          <v-list :two-line="copias.length === 0" :three-line="copias.length > 0" class="pt-0">
            <v-list-item class="px-0">
              <v-list-item-avatar rounded>
                <v-avatar
                  color="indigo"
                  size="40"
                  rounded
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
                </v-list-item-title>
                <v-list-item-subtitle v-if="isRecibido" v-text="doc.propietario.jefe.nombres_apellidos" />
                <template v-if="isEnviado">
                  <v-list-item-subtitle>
                    Enviado a:
                    <span v-if="doc.estatus === 'enviado_all'">COMUNIDAD UNIVERSITARIA</span>
                    <span v-else v-text="textEnviados" />
                    <v-icon class="mt-n1" @click="showModalEnviados">mdi-menu-down</v-icon>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="copias.length > 0">
                    Copias a: {{ textCopia }}
                    <v-icon class="mt-n1" @click="showModalCopias">mdi-menu-down</v-icon>
                  </v-list-item-subtitle>
                </template>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex align-start justify-end pr-6"
        >
         <span class="text-subtitle-1 blue-grey--text pb-6">{{ doc.fecha_enviado | FullDate }}</span>
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
    <list-departaments-send v-model="showList" :items="enviados" />
    <list-departaments-send v-model="showListCopy" :items="copias" copias />
  </v-container>
</template>
<script>
  import { get } from 'vuex-pathify'
  import { viewDocument } from '@/services/documento'
  import { screenshot } from '@/util/CaptureData'
  import store from '@/store'

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
    ListDepartamentsSend: () => import(
      /* webpackChunkName: "list-departament-send" */
      '@/widgets/ListDepartamentsSend.vue'
    ),
    LoaderDoc: () => import(
      /* webpackChunkName: "loader-doc" */
      './components/LoaderDoc.vue'
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
    enviados: [],
    colorTipo: {
      circular: 'tertiary',
      oficio: 'info'
    },
    showList: false,
    showListCopy: false,

  }),
  computed: {
    id: get('route/params@id'),
    tab: get('route/query@tab'),
    infoDepart: get('user/departamento'),
    isEnviado () {
      return this.tab === 'enviado'
    },
    isRecibido () {
      return this.tab === 'recibido'
    },
    textEnviados () {
      const more = this.enviados.length > 2 ? `... +${this.enviados.length - 2}` : ''
      return this.enviados.length > 0
        ? this.enviados.slice(0,2).map(item => item.nombre).join(', ') + more
        : ''
    },
    textCopia () {
      const more = this.copias.length > 2 ? `... +${this.copias.length - 2}` : ''
      return this.copias.length > 0
        ? this.copias.slice(0,1).map(item => item.nombre).join(', ') + more
        : ''
    },
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

        if(this.isRecibido) {
          this.destinatario = dataDoc.tipo_documento === 'circular'
            ? enviados
            : enviados.filter(item => item.id === this.infoDepart.id)[0]
        }

        if(this.isEnviado) {
          this.destinatario = dataDoc.tipo_documento === 'circular'
            ? enviados
            : enviados[0]
          this.enviados = enviados
        }

        this.copias = dpto_copias
        this.doc.nro_documento = this.doc.nro_documento.toString().padStart(4, '0')
        this.anexos = anexos.map(item => {
          return {
            file: item,
            loader:false
          }
        })

        if(this.isRecibido) {
          await store.dispatch('app/getNewDocuments');
        }

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
    },

    showModalEnviados () {
      this.showList = true
    },
    showModalCopias () {
      this.showListCopy = true
    },
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
