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
        <v-row justify="center" class="mx-0 mt-0">
          <v-col cols="12" class="pa-0">
            <document
              :data-doc="dataDocumento"
              :loading="loadingPdf"
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
 import { generatePreview } from '@/services/documento'
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
      dataDocumento: {
        pdf: null
      },
      loadingPdf: false
    }
  },
  computed: {
    infoDepart: get('user/departamento'),
    documento () {
      return {
        contenido: this.doc.contenido,
        tipo_documento: this.doc.tipo_documento,
        nro_documento: '******',
        fecha_enviado: this.today,
        propietario: this.infoDepart.id
      }
    },
    isCircular () {
      return this.doc.tipo_documento === 'circular'
    },
    hasCopia () {
      return this.dataDptos.copias && this.dataDptos.copias.length > 0
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

      return typeof this.dataDptos?.destinatario === 'object'
        ? this.dataDptos?.destinatario.map(item => item.nombre).join(', ')
        : ''
    },
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
    doc: {
      immediate: true,
      handler: 'getPreview'
    }
  },
  methods: {
    async getPreview(){
      console.log('DATA => ',this.dataDptos)
      const datos = {
        ...this.documento,
        copias: this.hasCopia ? this.dataDptos.copias.map(item => item.nombre).join(', ') : null,
        destinoCircular: this.isCircular ? this.destinoCircular : null,
        jefe_destino: this.dataDptos?.destinatario && !this.dataDptos?.destinatario.length ? this.dataDptos?.destinatario?.jefe?.nombres_apellidos ?? 'Jefe Departamento' : 'Jefe Departamento',
        jefe_cargo_destino: this.dataDptos?.destinatario && !this.dataDptos?.destinatario.length ? this.dataDptos?.destinatario?.jefe?.cargo ?? 'S/C' : 'S/C'
      };
      this.loadingPdf = true;
      try {
        const { data = {} } = await generatePreview({ datos });
        this.dataDocumento = {...data}

      } catch (error) {
        console.error({error})
      } finally {
        this.loadingPdf = false
      }
    }
  }
}
</script>
