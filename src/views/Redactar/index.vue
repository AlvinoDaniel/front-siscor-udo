<template>
  <v-container
    id="redactar"
    fluid
    tag="section"
    class=""
  >
    <loader-app v-if="loading || loadingDoc" />
    <v-row class="pa-3">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h4 class="font-weight-bold">
          <v-icon left @click="$router.go(-1)">
            mdi-arrow-left
          </v-icon>
          Redactar Documento
        </h4>
        <div
          v-if="!loadingDoc"
          class="d-flex"
        >
          <v-file-input
            hide-input
            hide-details
            dense
            prepend-icon="mdi-paperclip"
            class="pt-0 mt-0 mx-1 btn-adjuntar"
            @change="addAnexo"
          />
          <v-btn
            v-if="estatus === 'nuevo' || isBorrador"
            small
            outlined
            depressed
            color="blue-grey"
            class="mx-1 rounded-lg"
            @click="saveDocument('borrador')"
          >
            <v-icon left color="secondary">mdi-text-box-outline</v-icon>
            <span v-if="isBorrador" class="pr-1">Guardar </span>
            Borrador
          </v-btn>
          <v-btn
            v-if="estatus === 'nuevo' || isCorregir"
            small
            :outlined="$hasPermission('jefe')"
            :color="$hasPermission('jefe') ? 'blue-grey' : 'secondary'"
            class="mx-1 rounded-lg"
            depressed
            @click="saveDocument('corregir')"
          >
            <v-icon color="secondary" left>mdi-email-edit-outline</v-icon>
            <span v-if="isCorregir" class="pr-1">Guardar </span>
            Corregir
          </v-btn>
          <v-btn
            v-if="$hasPermission('jefe')"
            small
            depressed
            color="secondary"
            class="mx-1 rounded-lg"
            @click="saveDocument('enviar')"
          >
            <v-icon left>mdi-send-outline</v-icon>
            Enviar
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <validation-observer ref="WRITE_FORM">
      <v-row class="pa-3">
        <v-col cols="12" class="py-0">
          <validation-provider name="Tipo de Documento" vid="doc.tipo_documento" rules="required" v-slot="{ errors }">
            <div class="input-redactar theme--light d-flex align-self-center pb-2">
              <div class="v-input__control">
                <div class="border-input v-input__slot pb-2">
                  <div class="v-input__prepend-inner">
                    <span class="px-2 pt-1"> Tipo: </span>
                  </div>
                    <v-radio-group
                      v-model="doc.tipo_documento"
                      hide-details
                      row
                      class="mt-0 pt-0"
                      active-class="active-type font-weight-bold"
                      @change="clearInputs"
                    >
                      <v-radio
                        color="secondary"
                        value="oficio"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <v-icon small left>mdi-file-document-outline</v-icon>
                          <span>Oficio</span>
                        </template>
                      </v-radio>
                      <v-radio
                        color="secondary"
                        value="circular"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <v-icon small left>mdi-text-box-multiple-outline</v-icon>
                          <span>Circular</span>
                        </template>
                      </v-radio>
                    </v-radio-group>
                </div>
              </div>
            </div>
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Enviar" vid="dataDpto.destino" rules="required" v-slot="{ errors }">
            <select-departamento
              v-model="dataDpto.destino"
              label-text="Enviar a:"
              class="input-redactar input-cc"
              :items="allDepartamentos"
              :multiple="isCircular"
              :error="errors[0]"
              :btn-copia="!isCircular"
              @showCopia="getShowCopia"
              @change="verificateCopia"
            />
          </validation-provider>
        </v-col>
        <v-col v-if="copiaShow" cols="12" class="py-0">
          <validation-provider name="Copias" vid="dataDpto.copias" rules="" v-slot="{ errors }">
            <select-departamento
              v-model="dataDpto.copias"
              label-text="Copias a:"
              class="input-redactar"
              :items="getDepartamentosCopia"
              multiple
              :error="errors[0]"
              :btn-copia="false"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Asunto" vid="doc.asunto" v-slot="{ errors }">
            <v-text-field
              v-model="doc.asunto"
              class="input-redactar"
              :error-messages="errors[0]"
            >
              <template v-slot:prepend-inner>
                <span class="px-2">
                  Asunto:
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col v-if="anexos.length > 0 && isOficio" cols="12" class="pt-0">
          <div class="input-redactar theme--light d-flex align-self-center">
            <div class="v-input__control">
              <div class="v-input__slot pb-3">
                <div class="v-input__prepend-inner">
                  <span class="px-2 pt-1">Anexos: </span>
                </div>
                <list-anexos
                  :anexos="anexos"
                  @delete="deleteAnexo"
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <div class="input-redactar theme--light d-flex align-self-center">
            <div class="v-input__control">
              <div class="v-input__slot pb-0 justify-space-between">
                <div class="v-input__prepend-inner">
                  <span class="px-2 pt-1">Contenido: </span>
                </div>
                <v-btn
                  class="btn-cc"
                  color="blue-grey"
                  text
                  :disabled="doc.contenido === ''"
                  @click="previewShow = true"
                >
                  <v-icon left>mdi-file-search-outline</v-icon>
                  Vista Previa
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          class="pt-0"
        >
          <validation-provider
            v-slot="{ errors, touched, invalid }"
            ref="contenido"
            name="Contenido"
            vid="doc.contenido"
            rules="required"
          >
            <div :class="{ 'invalid': touched && invalid }">
              <ckeditor
                v-model="doc.contenido"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
            <div v-if="touched" class=" pt-2 v-messages theme--light error--text" role="alert">
              <div class="v-messages__wrapper">
                <div class="v-messages__message" v-text="errors[0]" />
              </div>
            </div>
          </validation-provider>
        </v-col>
      </v-row>
    </validation-observer>
    <preview
      v-model="previewShow"
      :doc="doc"
      :data-dptos="previewDptos"
    />
  </v-container>
</template>
<script>

  import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
  import '@ckeditor/ckeditor5-build-classic/build/translations/es'
  import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
  import Indent from '@ckeditor/ckeditor5-indent/src/indent'
  import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
  import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
  import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
  import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
  import StrikethroughPlugin from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
  import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
  import SubscriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/subscript';
  import SuperscriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/superscript';
  import Heading from '@ckeditor/ckeditor5-heading/src/heading';
  import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
  import Font from '@ckeditor/ckeditor5-font/src/font';
  import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
  import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';

  import { getDepartamentoList } from '@/services/departamento'
  import { sendDocument, viewDocument, updateDocument, deleteAttach } from '@/services/documento'
  import { get } from 'vuex-pathify'
  import { validateFile } from '@/util/helpers'

export default {
  name: 'Redactar',
   components: {
    SelectDepartamento: () => import(
      /* webpackChunkName: "select-departamento" */
      './components/SelectDepartamento.vue'
    ),
    ListAnexos: () => import(
      /* webpackChunkName: "list-anexos" */
      './components/ListAnexos.vue'
    ),
    Preview: () => import(
      /* webpackChunkName: "preview" */
      './components/Preview.vue'
    ),
  },
  data: () => ({
    doc: {
      asunto: '',
      contenido: '',
      tipo_documento: 'oficio',
      departamentos_destino: '',
      departamentos_copias: '',
      copias: false,
      estatus: '',
    },
    dataDpto: {
      destino: [],
      copias: [],
    },
    estatus: 'nuevo',
    anexos: [],
    copiaShow: false,
    previewShow: false,
    editor: ClassicEditor,
    editorConfig: {
      language: 'es',
      plugins: [
        EssentialsPlugin,
        BoldPlugin,
        ItalicPlugin,
        ParagraphPlugin,
        Alignment,
        Heading,
        StrikethroughPlugin,
        UnderlinePlugin,
        SubscriptPlugin,
        SuperscriptPlugin,
        Indent,
        Autoformat,
        Font,
        Highlight,
        RemoveFormat,
      ],
      toolbar: {
        items: [
          'heading', '|',
          'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
          'removeFormat', 'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
          'alignment', '|',
          'outdent', 'indent', 'undo', 'redo',
        ],
      },
    },
    departamentos: [],
    loading: false,
    loadingDoc: false,
    urlBandejas: {
      enviar: 'Enviados',
      corregir: 'Por Corregir',
      borrador: 'Borradores',
    },
  }),
  computed: {
    doc_id: get('route/params@doc'),
    isCircular () {
      return this.doc.tipo_documento === 'circular'
    },
    isOficio () {
      return this.doc.tipo_documento === 'oficio'
    },
    isBorrador () {
      return this.estatus === 'borrador'
    },
    isCorregir () {
      return this.estatus === 'por_corregir'
    },
    allDepartamentos () {
      const comunidad = {
        id: 'all',
        nombre: 'Comunidad Universitaria',
        siglas: 'CU',
        jefe: {
          nombres_apellidos: 'Todos los Departamentos'
        }
      }
      const data = this.departamentos.map(item => {
        return {
          ...item,
          disabled: typeof this.dataDpto.destino === 'object' && this.dataDpto.destino.includes('all')
        }
      })
      if (this.isCircular) data.unshift(comunidad)

      return data
    },
    getDepartamentosCopia () {
     if (this.departamentos.length === 0) return []

      return this.departamentos.filter(item => {

        // if (this.dataDpto.destino.length === 0) return true

        return typeof this.dataDpto.destino === 'object'
         ? !this.dataDpto.destino.includes(item.id)
         : this.dataDpto.destino !== item.id
      })
    },
    destinosCircular () {
      const defaultData = [{ nombre: 'SIN DEFINIR' }]

      return this.dataDpto.destino.length > 0
        ? this.departamentos.filter(item => this.dataDpto.destino.includes(item.id))
        : defaultData
    },
    destinos () {
       const defaultValue = {
        nombre: 'DEPARTAMENTO SIN DEFINIR',
        siglas: 'XX',
        jefe: {
          nombres_apellidos: 'JEFE DE DEPARTAMENTO',
          descripcion_cargo: 'SIN DEFINIR',
        },
      }

      return typeof this.dataDpto.destino === 'number'
        ? this.departamentos.filter(item => item.id === this.dataDpto.destino)[0]
        : defaultValue
    },
    previewDptos () {
      return {
        destinatario: this.isCircular ? this.destinosCircular : this.destinos,
        copias: this.departamentos.filter(item => this.dataDpto.copias.includes(item.id)),
      }
    },
  },
  created () {
    this.getDepartamentos()
    if (this.doc_id) {
      this.getDocumento()
    }
  },
  methods: {
    async getDepartamentos () {
      this.loading = true
      try {
        const { departamentos } = await getDepartamentoList()
        this.departamentos = departamentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async saveDocument (status) {
      const valid = await this.$refs.WRITE_FORM.validate()
      if (valid) {
        this.doc.estatus = status;
        this.doc.departamentos_destino = this.isCircular ? this.dataDpto.destino.join(',') : this.dataDpto.destino.toString()
        this.doc.copias = this.dataDpto.copias.length > 0 ? '1' : '0'
        this.doc.departamentos_copias = this.dataDpto.copias.length > 0 ? this.dataDpto.copias.join(',') : ''

        const data = new FormData()
        for (const key in this.doc) {
          if (Object.hasOwnProperty.call(this.doc, key)) {
            data.append(key, this.doc[key])
          }
        }

        if (this.anexos.length > 0) {
          this.anexos
            .filter(item => 'File' in window && item.file instanceof File)
            .forEach(anexo => {
              data.append('anexos[]', anexo.file)
          })
        }

        this.loading = true
        try {
          const { message } = this.doc_id
            ? await updateDocument({ datos: data, id: this.doc_id })
            : await sendDocument({ datos: data, status })

           this.$root.$showAlert(message, 'success')
           this.$router.push({ name: this.urlBandejas[status] })
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      } else {
        this.$refs.contenido.setFlags({ touched: true })
      }
    },

    async getDocumento () {
      this.loadingDoc = true
      try {
        const { temporal, anexos, ...documento } = await viewDocument({ id: this.doc_id, estatus: 'temporal' })
        this.doc.asunto = documento.asunto
        this.doc.contenido = documento.contenido
        this.doc.tipo_documento = documento.tipo_documento
        this.doc.copias = temporal?.departamentos_copias !== null

        this.dataDpto.destino = documento.tipo_documento === 'circular'
          ? temporal?.departamentos_destino.split(',').map(item => item !== 'all' ? parseInt(item) : item)
          : parseInt(temporal?.departamentos_destino)

        this.dataDpto.copias = temporal.departamentos_copias !== null
          ? temporal.departamentos_copias.split(',')
          : []

        this.estatus = documento.estatus
        this.anexos = anexos.length > 0
          ? anexos.map(item => ({ file:{name: item.nombre, id: item.id}, loader:false }))
          : []
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingDoc = false
      }
    },

    clearInputs (event) {
      this.dataDpto.destino = ''
      this.dataDpto.copias = ''
      this.$refs.WRITE_FORM.reset()
    },

    getShowCopia (value) {
      this.copiaShow = value
      this.dataDpto.copias = []
    },

    verificateCopia (val) {
      if (this.dataDpto.copias.length > 0) {
        const index = this.dataDpto.copias.indexOf(val)
        if (index >= 0) this.dataDpto.copias.splice(index, 1)
      }
    },

    addAnexo (file) {
      console.log(typeof file)
      const isPermited = validateFile(file.type)
      if (!isPermited) {
         this.$root.$showAlert(
          'Formato inválido. Solo se permiten Imágenes y/o Documentos.',
          'error',
          'mdi-file-remove-outline',
        )
        return
      }

      this.anexos.push({file:file, loader:false})
    },

    async deleteAnexo (index) {
      if (this.doc_id && this.anexos[index].file.id) {
        this.anexos[index].loader = true
        try {
          const { message } = await deleteAttach({id: this.anexos[index].file.id })
          this.$root.$showAlert(
            'Se ha eliminado el anexo exitosamente',
            'success',
          )
        } catch (error) {
          this.$root.$showAlert(
            'Hubo un error al intentar eliminar el anexo.',
            'error',
          )
          this.anexos[index].loader = false
          return
        }
      }
      this.anexos.splice(index, 1)
    },
  },
}
// E2E7F1
</script>
<style lang="sass">
  .input-redactar
    padding-top: 5px
    & input
      padding: 20px 0 20px !important
    & .v-input__prepend-inner
      display: flex
      align-self: center
      padding-bottom: 5px
      & span
        min-width: 100px
        color: #78909c !important
        caret-color: #78909c !important
        font-weight: 500 !important
  .input-cc .v-input__append-outer
    position: absolute
    top: 0
    transform: translateY(5%)
    right: 0
  .input-cc .v-select__slot
    margin-right: 80px

  .border-input.v-input__slot::before
    border-color: rgba(0, 0, 0, 0.42)
    border-style: solid
    border-width: thin 0 0 0
    bottom: -1px
    content: ""
    left: 0
    position: absolute
    -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    width: 100%

  .btn-adjuntar
    & .v-input__prepend-outer
      margin-top: 2px !important
    & .v-icon.v-icon
      font-size: 20px
      color: #2db2d5 !important
    & button
      border: thin solid #607d8b
      border-radius: 8px !important
      padding: 0 8.4444444444px
      height: 28px
      &.v-icon.v-icon::after
        background-color: transparent !important
  .active-type .v-label, .active-type i
    color: #2DB2D5 !important
    font-weight: 500 !important

  .ck.ck-editor__main>.ck-editor__editable
    min-height: 200px !important

  .invalid .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)
    border-color: #ff5252 !important

</style>
