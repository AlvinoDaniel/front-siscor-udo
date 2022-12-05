<template>
  <div class="page-container">
    <div id="pageDocument" class="page page-shadow">
      <div class="page-content">
        <div>
          <div class="page-header">
            <img :src="udoLogo" width="70" height="62">
            <span>UNIVERSIDAD DE ORIENTE</span>
            <span v-text="dataDoc.propietario.nombre" />
            <span>RECTORADO</span>
          </div>
          <div class="page-date">
            <span class="font-bold">{{ dataDoc.propietario.siglas }} N° {{ dataDoc.nro_documento }}-{{ year }}</span>
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
                v-text="destinatario.jefe.nombres_apellidos"
              />
              <span
                class="font-bold"
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
            <span>Atentamente,</span>
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
        <span style="font-size:10px">Calle el Parque. Transversal con Avenida Gran Mariscal. Quinta Villa Angelitos. Cumaná – Edo. Sucre. Teléfonos 0293-4008220 / 4008221</span>
      </div>
    </div>
  </div>
</template>
<script>
import { LogoUdo } from '@/util/Iconos'
import moment from 'moment'

export default {
  name: 'Document',
  props: {
    dataDoc: {
      type: Object,
      default: () => ({}),
    },
    destinatario: {
      type: [Object, Array],
      default: () => ([]),
    },
    copias: {
      type: Array,
      default: () => ([]),
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    year: moment().format('YYYY'),
    udoLogo: LogoUdo,
  }),
  computed: {
    isCircular () {
      return this.dataDoc.tipo_documento === 'circular'
    },
    hasCopia () {
      return this.copias.length > 0
    },
    dataCopia () {
      return this.copias.map(item => item.nombre).join(', ')
    },
    isFirma (){
      return this.dataDoc.propietario.jefe.baseUrlFirma !== null
    },
    destinoCircular () {
      const comunidad = {
        nombre: 'Comunidad Universitaria',
        siglas: 'CU',
        jefe: {
          nombres_apellidos: 'Todos los Departamentos'
        },
      }

      if (this.dataDoc?.estatus === 'enviado_all') {
        return comunidad.nombre
      }

      return typeof this.destinatario === 'object'
        ? this.destinatario.map(item => item.nombre).join(', ')
        : ''
    },
  },
  methods: {

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
</style>
