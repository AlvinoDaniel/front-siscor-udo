<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="secondary"
        dense
        tile
      >
        <v-btn
          icon
          dark
          @click="show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Vista Previa</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-row justify="center" class="mx-0">
          <v-col cols="12" class="pa-0">
            <document
              :data-doc="documento"
              :destinatario="dataDptos.destinatario"
              :copias="dataDptos.copias"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { get } from 'vuex-pathify'
import moment from 'moment'
export default {
  name: 'Preview',
  components: {
     Document: () => import(
      /* webpackChunkName: "document" */
      '@/widgets/Document'
    ),
  },
  props: {
    value: Boolean,
    doc: {
      type: Object,
      default: () => ({})
    },
    dataDptos: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      show: this.value,
      today: moment().format('YYYY-MM-DD'),
    }
  },
  computed: {
    infoDepart: get('user/departamento'),
    documento () {
      return {
        contenido: this.doc.contenido,
        tipo_documento: this.doc.tipo_documento,
        nro_documento: '****',
        fecha_enviado: this.today,
        propietario: {
          nombre: this.infoDepart.nombre,
          nucleo: this.infoDepart.nucleo,
          siglas: this.infoDepart.siglas,
          jefe: {
            nombres_apellidos: this.infoDepart.jefe,
            descripcion_cargo: this.infoDepart.cargo_jefe,
            baseUrlFirma: this.infoDepart.firma_base_url,
          },
        },
      }
    }
  },
  watch: {
    show (val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value (val, oldVal) {
      if (val === oldVal) return

      this.show = val
    },
  },
}
</script>
