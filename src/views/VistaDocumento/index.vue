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
        <v-col cols="12" class="pb-0 d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon left @click="$router.go(-1)" color="blue-grey lighten-2">
              mdi-arrow-left
            </v-icon>
            <span class="text-h4 font-weight-bold primary--text d-block ml-2" v-text="doc.asunto" />
            <v-chip
              class="text-uppercase pl-1 pr-2 py-2 font-weight-light mx-3 mt-1"
              :color="colorTipo[doc.tipo_documento]"
              x-small
              outlined
              label
              >
              <v-icon size="14">mdi-circle-medium</v-icon>
              {{ doc.tipo_documento }}
            </v-chip>
          </div>
          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="isRecibido"
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
                  <!-- mdi-image-plus mdi-camera-plus -->
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
          </div>
        </v-col>
        <!-- <v-col cols="12" md="11" class="pt-0">
          <span class="text-h4 font-weight-bold primary--text d-block" v-text="doc.asunto" />
        </v-col> -->
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
                    v-text="doc.propietario.siglas || toInitials(doc.propietario.nombre)"
                  />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  <span v-text="doc.propietario.nombre" />
                </v-list-item-title>
                <v-list-item-subtitle v-if="isRecibido" v-text="doc.propietario.jefe.nombres_apellidos" />
                <template v-if="isEnviado">
                  <v-list-item-subtitle class="align-center">
                    Enviado a:
                    <span v-if="doc.estatus === 'enviado_all'">COMUNIDAD UNIVERSITARIA</span>
                    <span v-else v-text="textEnviados" />
                    <v-btn
                      x-small
                      plain
                      icon
                      depressed
                      @click="showModalEnviados"
                    >
                      <v-icon size="28" >mdi-menu-down</v-icon>
                    </v-btn>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="copias.length > 0">
                    Copias a: {{ textCopia }}
                    <v-btn
                    x-small
                    plain
                    icon
                    depressed
                    @click="showModalCopias"
                  >
                    <v-icon size="28" >mdi-menu-down</v-icon>
                  </v-btn>
                  </v-list-item-subtitle>
                </template>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex align-center justify-end pr-6"
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
          <document :data-doc="doc" :destinatario="destinatario" :copias="copias"/>
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
  import { viewDocument, downloadDocument } from '@/services/documento'
  import { screenshot } from '@/util/CaptureData'
  import  exportPDF from '@/util/ExportPDF'
  import store from '@/store'
  import { getInitals } from '@/util/helpers'
  import { encode, decode } from 'js-base64';
  import moment from 'moment'

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
    downloading: false,
    messageAwait: ''

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
    toInitials: getInitals,

    async getDocumento () {
      this.loading = true
      try {
        const { enviados, dpto_copias, anexos, ...dataDoc } = await viewDocument({ id: decode(this.id), estatus: 'enviado' })
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
      const { tipo_documento, propietario: { nombre } } = this.doc
      const date = moment().valueOf()
      const fileName = `${tipo_documento}_${nombre}_${date}.pdf`
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
      const { tipo_documento, propietario: { nombre } } = this.doc
      const date = moment().valueOf()
      const fileName = `${tipo_documento}_${nombre}_${date}.pdf`
      this.downloading = true;
      this.messageAwait= `Descargando ${tipo_documento}, espere por favor...`
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
