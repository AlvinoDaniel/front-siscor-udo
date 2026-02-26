<template>
  <div class="pdf-container">
    <!-- <div v-if="pdfDoc" class="pdf-toolbar">
      <span>Documento Cargado: {{ totalPages }} páginas</span>
      <div class="zoom-controls">
        <button @click="changeZoom(-0.2)">-</button>
        <span>{{ Math.round(scale * 100) }}%</span>
        <button @click="changeZoom(0.2)">+</button>
      </div>
    </div> -->

    <loader-doc v-if="loading" />


    <div v-if="!loading" ref="scrollContainer" class="pdf-scroll-viewport">
      <div v-for="page in totalPages" :key="page" class="pdf-page-wrapper">
        <canvas :id="`pdf-canvas-${page}`"></canvas>
      </div>
    </div>

    <div v-if="totalPages > 0 && !loading" class="floating-toolbar">
      <button class="zoom-btn" @click="changeZoom(-0.25)" title="Alejar">
        <i class="icon-minus">−</i>
      </button>

      <div class="zoom-display">{{ Math.round(scale * 100) }}%</div>

      <button class="zoom-btn" @click="changeZoom(0.25)" title="Acercar">
        <i class="icon-plus">+</i>
      </button>
    </div>
  </div>
  <!-- <div class="page-container">
    <div id="pageDocument" class="page page-shadow">
      <div class="page-content">
        <div>
          <div class="page-header">
            <img :src="udoLogo" width="70" height="68">
            <span>UNIVERSIDAD DE ORIENTE</span>
            <span v-text="dataDoc.propietario.nombre" />
            <span v-if="dataDoc.propietario.nucleo" v-text="dataDoc.propietario.nucleo.nombre" />
          </div>
          <div class="page-date">
            <span  v-if="!externo" class="font-bold">{{ dataDoc.propietario.siglas || toInitials(dataDoc.propietario.nombre) }} N° {{ dataDoc.nro_documento }}-{{ year }}</span>
            <span v-else class="font-bold">{{ dataDoc.propietario.siglas || toInitials(dataDoc.propietario.nombre) }} N° {{ dataDoc.nro_documento }}</span>
            <span>Cumaná, {{ dataDoc.fecha_enviado | DocDate }}</span>
          </div>
          <div v-if="isCircular" class="page-header title-header">
            <span>CIRCULAR</span>
          </div>
          <template v-if="isCircular">
            <div class="page-addressee">
              <p>
                <span>Para:</span>
                <span class="font-bold font-uppercase"> {{ destinoCircular }}</span>
              </p>
              <p>
                <span>De: </span>
                <span class="font-bold font-uppercase"> {{ dataDoc.propietario.nombre }}</span>
              </p>
            </div>
          </template>
          <template v-else>
            <div class="page-addressee">
              <span>Ciudadano(a):</span>
              <span
                class="font-bold"
                v-if="!externo"
                v-text="destinatario.jefe.nombres_apellidos"
              />
              <span
                class="font-bold"
                v-if="externo"
                v-text="remitente.nombre_legal"
              />
              <span
                class="font-bold"
                v-if="!externo"
                v-text="destinatario.jefe.descripcion_cargo"
              />
              <span>Su Despacho.- </span>
            </div>
          </template>
          <div
            class="page-body"
            v-html="dataDoc.contenido"
          />
          <div class="page-sincerely">
            <span style="margin-bottom:5px">Atentamente,</span>
            <template v-if="isFirma">
              <v-img
                :src="dataDoc.propietario.jefe.baseUrlFirma"
                width="200"
              />
            </template>
            <div class="page-user-signature">
              <span v-text="dataDoc.propietario.jefe.nombres_apellidos" />
            </div>
            <span v-text="dataDoc.propietario.jefe.descripcion_cargo" />
          </div>
        </div>
        <template v-if="hasCopia">
          <div class="page-copys">
            <span>CC: </span>
            <span class="font-uppercase font-medium" v-text="dataCopia" />
          </div>
        </template>
      </div>
      <div class="page-footer">
        <span class="font-bold">DEL PUEBLO VENIMOS / HACIA EL PUEBLO VAMOS</span>
        <span class="text-center" style="font-size:10px" v-text="direccion" />
      </div>
    </div>
  </div> -->
</template>
<script>
import { LogoUdo, LOGO_UDO_COLOR } from '@/util/Iconos'
import moment from 'moment'
import { getInitals } from '@/util/helpers'
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf';
import pdfjsWorker from 'pdfjs-dist/es5/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default {
  name: 'Document',
  components: {
     LoaderDoc: () => import(
      /* webpackChunkName: "loader-doc" */
      '../views/VistaDocumento/components/LoaderDoc.vue'
    ),
  },
  props: {
    dataDoc: {
      type: Object,
      default: () => ({}),
    },
    destinatario: {
      type: [Object, Array],
      default: () => ([]),
    },
    remitente: {
      type: [Object, Array],
      default: () => ({}),
    },
    copias: {
      type: Array,
      default: () => ([]),
    },
    preview: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    year: moment().format('YYYY'),
    udoLogo: LOGO_UDO_COLOR,
    pdfDoc: null,
    totalPages: 0,
    loadingPages: false,
    scale: 1.2, // Zoom inicial
  }),
  created(){
    console.log(this.destinatario)
  },
  watch: {
    dataDoc: {
      immediate: true,
      handler: 'loadBase64Pdf'
    }
  },
  computed: {
    // isCircular () {
    //   return this.dataDoc.tipo_documento === 'circular'
    // },
    // hasCopia () {
    //   return this.copias.length > 0
    // },
    // dataCopia () {
    //   return this.copias.map(item => item.nombre).join(', ')
    // },
    // isFirma (){
    //   return this.dataDoc.propietario.jefe.baseUrlFirma !== null
    // },
    // destinoCircular () {
    //   const comunidad = {
    //     nombre: 'Comunidad Universitaria',
    //     siglas: 'CU',
    //     jefe: {
    //       nombres_apellidos: 'Todos los Departamentos'
    //     },
    //   }

    //   if (this.dataDoc?.estatus === 'enviado_all') {
    //     return comunidad.nombre
    //   }

    //   return typeof this.destinatario === 'object'
    //     ? this.destinatario.map(item => item.nombre).join(', ')
    //     : ''
    // },
    // direccion(){
    //   return this.dataDoc?.propietario?.direccion !== null
    //     ? this.dataDoc?.propietario?.direccion
    //     : this.dataDoc?.propietario?.nucleo?.direccion
    // }
  },
  methods: {
    toInitials: getInitals,
    async loadBase64Pdf() {
      if (!this.dataDoc.pdf) return;

      this.loadingPages = true;
      try {
        // 1. Limpiar el string si trae el prefijo de Data URI
        const pureBase64 = this.dataDoc.pdf.replace(/^data:application\/pdf;base64,/, '');

        // 2. Convertir Base64 a Uint8Array (Forma performante)
        const binaryString = window.atob(pureBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 3. Cargar en PDF.js
        this.pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
        this.totalPages = this.pdfDoc.numPages;

        this.$nextTick(() => {
          this.renderAllPages();
        });
      } catch (error) {
        console.error("Error al procesar Base64 PDF:", error);
      } finally {
        this.loadingPages = false;
      }
    },
    async renderAllPages() {
      // Limpiamos los canvas antes de re-renderizar (importante para el zoom)
      for (let i = 1; i <= this.totalPages; i++) {
        await this.renderPage(i);
      }
    },

    async renderPage(num) {
      const page = await this.pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: this.scale });

      const canvas = document.getElementById(`pdf-canvas-${num}`);
      if (!canvas) return;

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    },
    changeZoom(delta) {
      this.scale = Math.min(Math.max(this.scale + delta, 0.5), 3);
      this.renderAllPages();
    }
  },
}
</script>
<style>
.page-container {
  background-color: #ebe8e8;
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
  min-height: 11in;
  margin: 13px auto;
  border-collapse: separate;
  position: relative;
  background-color: white;
  overflow: hidden;
  border: 0;
  padding: 25px 60px 50px 60px;
  font-size: 11pt;
  color: #000000
}

.page-shadow {
  box-shadow: 1px 1px 3px 1px #333;
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
  margin-bottom: 20px;
}

.page-date {
  margin-bottom: 20px;
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

.page-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100% !important;
}
.page-copys {
  padding: 20px 0;
  text-align: justify;
  font-size: 10pt;
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

.title-header {
  font-size: 1.2em;
}

.font-bold {
  font-weight: bold !important;
}

.font-medium {
  font-weight: 400 !important;
}

.font-uppercase {
  text-transform: uppercase !important;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 90vh; */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   /* background-color: #ebe8e8; */
    background-color: rgba(245, 248, 250,0.85);
  background-blend-mode: lighten;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=);
    background-repeat: repeat;
    backdrop-filter: multiply;
    -webkit-transition: left 500ms;
    transition: left 500ms;
    position: relative;
}

.pdf-toolbar {
  height: 48px;
  background-color: #202124;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  z-index: 10;
}

.zoom-controls button {
  background: #444;
  border: none;
  color: white;
  padding: 5px 12px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 4px;
}

.pdf-scroll-viewport {
  flex: 1;
  overflow-y: auto;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.pdf-page-wrapper {
  background: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  border-radius: 2px;
}

canvas {
  display: block;
  max-width: 100%;
}

.page-footer {
  text-align: center;
  font-size: 11px;
  color: #999;
  padding: 8px;
  border-top: 1px solid #eee;
}

/* --- TOOLBAR FLOTANTE (Estilo Imagen) --- */
.floating-toolbar {
  position: fixed;
  bottom: 10px;
  left: 53%;
  display: flex;
  align-items: center;
  background-color: rgba(31, 31, 46, 0.9); /* Color oscuro profundo */
  backdrop-filter: blur(10px); /* Efecto de desenfoque moderno */
  padding: 8px 16px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.zoom-btn {
  background: transparent;
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  border-radius: 6px;
}

.zoom-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.zoom-display {
  padding: 0 15px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}
</style>
