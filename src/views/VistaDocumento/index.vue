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
          <!-- <div class="page-container">
            <div id="pageDocument" class="page">
              <div class="page-header">
                <img :src="udoLogo" width="70" height="62">
                <span>UNIVERSIDAD DE ORIENTE</span>
                <span v-text="doc.propietario.nombre" />
                <span>RECTORADO</span>
              </div>
              <div class="page-date">
                <span class="font-weight-bold">{{ doc.propietario.siglas }} N° {{ doc.nro_documento }}-{{ year }}</span>
                <span>Cumaná, {{ doc.fecha_enviado | DocDate }}</span>
              </div>
              <div class="page-addressee">
                <span>Ciudadano(a):</span>
                <span class="font-weight-bold" v-text="destinatario.jefe.nombres_apellidos" />
                <span class="font-weight-bold" v-text="destinatario.jefe.descripcion_cargo" />
                <span>Su Despacho.- </span>
              </div>
              <div class="page-body" v-html="doc.contenido" />
              <div class="page-sincerely">
                <span>Atentamente,</span>
                  <v-img
                    :src="
                      require('@/assets/firma-y-sello.png')"
                    width="200"
                  />
                <div class="page-user-signature">
                  <span v-text="doc.propietario.jefe.nombres_apellidos" />
                </div>
                <span v-text="doc.propietario.nombre" />
              </div>
              <div class="page-footer">
                <span class="font-weight-bold">DEL PUEBLO VENIMOS / HACIA EL PUEBLO VAMOS</span>
                <span style="font-size:10px">Calle el Parque. Transversal con Avenida Gran Mariscal. Quinta Villa Angelitos. Cumaná – Edo. Sucre. Teléfonos 0293-4008220 / 4008221</span>
              </div>
            </div>
          </div> -->
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
        const { enviados, dpto_copias, ...dataDoc } = await viewDocument({ id: this.id })
        this.doc = { ...dataDoc }
        this.destinatario = enviados.filter(item => item.id === this.infoDepart.departamento_id)[0]
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
<style>
.page-container {
    background-color: #ffffff;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=);
    background-repeat: repeat;
    backdrop-filter: multiply;
    -webkit-transition: left 500ms;
    transition: left 500ms;
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    overflow: auto;
    padding: 15px;
    border-radius: 5px;
}

.page {
  width: 8.5in;
  height: 11in;
  margin: 13px auto;
  box-shadow: 1px 1px 3px 1px #333;
  border-collapse: separate;
  position: relative;
  background-color: white;
  overflow: hidden;
  border: 0;
  padding: 25px 60px;
  font-size: 11pt;
}

.page p {
  margin-bottom: 8px !important;
  text-align: justify;
}

.page-header {
  align-items: center;
  font-weight: bold;
  text-transform: uppercase;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: column !important;
  flex-direction: column !important;
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
}

.page-date {
  margin: 20px 0px;
   display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: column !important;
  flex-direction: column !important;
  -webkit-box-align: end !important;
  -ms-flex-align: end !important;
  align-items: end !important;
}

.page-header img {
  margin: 5px 10px;
}

.page-addressee {
  margin: 10px 0;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: column !important;
  flex-direction: column !important;
}

.page-body {
  margin: 10px 0;
  text-align: justify;
}

.page-sincerely {
  font-weight: bold;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: column !important;
  flex-direction: column !important;
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}
.page-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 5px 25px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 100%;
}

.page-user-signature {
  margin-top: 15px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 5px;
  border-color: black;
  border-style: solid;
  border-width: 1px 0 0 0;
}

</style>
