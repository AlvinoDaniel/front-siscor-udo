<template>
  <v-container
    id="vista"
    fluid
    tag="section"
    class="px-8"
  >
    <loader-doc v-if="loading" />
    <section
    v-if="(doc !== null && !loading)"
    id="header"
    >
      <v-row align="center">
        <v-col cols="12" class="pb-1 d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon left @click="$router.go(-1)" color="blue-grey lighten-2">
              mdi-arrow-left
            </v-icon>
            <span class="text-h4 font-weight-bold primary--text d-block ml-2" v-text="doc.asunto" />
            <!-- <v-chip
              class="text-uppercase pl-1 pr-2 py-2 font-weight-light mx-3 mt-1"
              :color="colorTipo[doc.tipo_documento]"
              x-small
              outlined
              label
              >
              <v-icon size="14">mdi-circle-medium</v-icon>
              {{ doc.tipo_documento }}
            </v-chip> -->
          </div>
          <!-- <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="blue-grey lighten-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="responseDocument"
                  >
                  <v-icon size="22">mdi-undo-variant</v-icon>
                </v-btn>
              </template>
              <span>Responder</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="blue-grey lighten-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="getScreenshot"
                  >
                  <v-icon size="22">mdi-camera-plus-outline</v-icon>
                </v-btn>
              </template>
              <span>Capturar Documento</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="blue-grey lighten-2"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="downloading"
                  @click="generatePDF"
                >
                  <v-icon size="22">mdi-file-download-outline</v-icon>
                </v-btn>
              </template>
              <span>Descargar</span>
            </v-tooltip>
          </div> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" class="d-flex align-center pb-0">
          <v-list class="pt-0">
            <v-list-item class="px-0">
              <v-list-item-avatar rounded>
                <v-avatar
                  color="indigo"
                  size="40"
                  rounded
                >
                  <span
                    class="white--text font-weight-bold text-4 text-uppercase"
                    v-text="doc.remitente.nombre_legal.at(0)"
                  />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold text-h5">
                  <span v-text="doc.remitente.nombre_legal" />
                </v-list-item-title>
                <v-list-item-subtitle v-text="doc.remitente.documento_identidad" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="d-flex align-center justify-end pr-6"
        >
         <span class="text-subtitle-1 blue-grey--text mr-2">{{ doc.fecha_entrada | smartDate }}</span>
         <v-divider vertical inset class="my-5 mx-2"></v-divider>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              text
              color="blue-grey lighten-2"
              v-bind="attrs"
              v-on="on"
              @click="responseDocument"
              >
              <v-icon left size="22">mdi-undo-variant</v-icon>
              responder
            </v-btn>
          </template>
          <span>Responder</span>
        </v-tooltip>
        <v-divider vertical inset class="my-5 mx-2"></v-divider>
         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              text
              rounded
              color="blue-grey lighten-2"
              v-bind="attrs"
              v-on="on"
              :disabled="downloading"
              @click="generatePDF"
            >
              <v-icon left size="22">mdi-file-download-outline</v-icon>
              Descargar
            </v-btn>
          </template>
          <span>Descargar</span>
        </v-tooltip>
        </v-col>
        <v-col cols="12">
          <document-externo :data-doc="doc"/>
        </v-col>
      </v-row>
    </section>
    <material-wait
      v-model="downloading"
      icon="mdi-file-download-outline"
      :text="messageAwait"
    />
    <list-departaments-send v-model="showList" :items="enviados" />
    <list-departaments-send v-model="showListCopy" :items="copias" copias />
  </v-container>
</template>
<script>
  import { get } from 'vuex-pathify'
  import { viewDocument, downloadDocument } from '@/services/externo'
  import { screenshot } from '@/util/CaptureData'
  import  exportPDF from '@/util/ExportPDF'
  import store from '@/store'
  import { getInitals } from '@/util/helpers'
  import { encode, decode } from 'js-base64';
  import moment from 'moment'

export default {
  name: 'Documento',
  components: {
    DocumentExterno: () => import(
      /* webpackChunkName: "document" */
      '@/widgets/DocumentExterno'
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
    downloading: false,
    messageAwait: ''

  }),
  computed: {
    id: get('route/params@id'),
    infoDepart: get('user/departamento'),
  },
  created () {
    this.getDocumento()
  },
  methods: {
    toInitials: getInitals,

    async getDocumento () {
      this.loading = true
      try {
        const { respuesta, ...dataDoc } = await viewDocument({ id: decode(this.id) })
        this.doc = { ...dataDoc }
      } catch (error) {
          if(error.response) {
            const { data: { errors } } = error?.response
            this.$root.$showAlert(errors?.message, 'error')
            this.$router.go(-1)
          }
          console.log(error.response.data)
      } finally {
        this.loading = false
      }
    },

    async getScreenshot () {
      const { remitente } = this.doc
      const date = moment().valueOf()
      const fileName = `Externo_${remitente?.nombre_legal.split(' ').join('_')}_${date}`
      const page = document.getElementById('pageDocument')
      page.classList.remove('page-shadow')
      try {
        await screenshot({
          id: 'pageDocument',
          title: fileName,
          width: '8.5in',
        })
      } catch (error) {
        console.log(error)
      } finally {
        page.classList.add('page-shadow')
      }
    },

    async generatePDF () {
      const { remitente } = this.doc

      const date = moment().valueOf()
      const fileName = `Externo_${remitente?.nombre_legal.split(' ').join('_')}_${date}.pdf`
      this.downloading = true;
      this.messageAwait= `Descargando documento, espere por favor...`
      try {
        const file = await downloadDocument({ id: decode(this.id) })
        var anexoURL = window.URL.createObjectURL(new Blob([file]));
        var anexoLink = document.createElement('a');

        anexoLink.href = anexoURL;
        anexoLink.setAttribute('download',fileName);
        document.body.appendChild(anexoLink);
        anexoLink.click();
        anexoLink.remove();
      } catch (error) {
        this.$root.$showAlert(
          'Lo siento, hubo un error al intentar obtener el Anexo.',
          'error'
        )
      }
      finally {
        this.downloading = false;
        this.messageAwait= ''
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

    responseDocument () {
      const {propietario, tipo_documento, nro_documento } = this.doc

      const PARAMS_JSON = {
        id: propietario?.id,
        tipo_documento,
        nro_documento,
      }
      const PARAMS_ENCODE = encode(JSON.stringify(PARAMS_JSON))
      this.$router.push({name: 'Redactar', query: {r: PARAMS_ENCODE}})
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
