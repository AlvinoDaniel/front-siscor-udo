<template>
  <v-container
    id="redactar"
    fluid
    tag="section"
    class=""
  >
    <loader-app v-if="loading" />
    <v-row class="pa-3">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h4 class="font-weight-bold">
          <v-icon left>mdi-arrow-left</v-icon>
          Redactar Documento
        </h4>
        <div class="d-flex">
          <!-- <v-btn
            v-if="isOficio"
            small
            outlined
            depressed
            color="blue-grey"
            class="mx-1 px-0 rounded-lg"
            @click="addAnexo"
          >
            <v-icon>mdi-paperclip</v-icon>
          </v-btn> -->

          <v-file-input
            hide-input
            multiple
            hide-details
            dense
            prepend-icon="mdi-paperclip"
            class="pt-0 mt-0 mx-1 btn-adjuntar"
            @change="addAnexo"
          />

          <v-btn small outlined @click="saveDocument('borrador')" depressed color="blue-grey" class="mx-1 rounded-lg">
            <v-icon left>mdi-text-box-outline</v-icon>
            Borrador
          </v-btn>
          <v-btn small outlined @click="saveDocument('corregir')" depressed color="blue-grey" class="mx-1 rounded-lg">
            <v-icon left>mdi-email-edit-outline</v-icon>
            Corregir
          </v-btn>
          <v-btn small @click="saveDocument('enviar')" depressed color="secondary" class="mx-1 rounded-lg">
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
            <div class="input-redactar theme--light d-flex align-self-center">
              <div class="v-input__control">
                <div class="border-input v-input__slot pb-3">
                  <div class="v-input__prepend-inner">
                    <span class="px-2 pt-1"> Tipo: </span>
                  </div>
                    <v-radio-group
                      v-model="doc.tipo_documento"
                      hide-details
                      row
                      class="mt-0 pt-0"
                      active-class="active-type"
                      @change="clearInputs"
                    >
                      <v-radio
                        color="tertiary"
                        value="oficio"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <v-icon small left>mdi-file-document-outline</v-icon>
                          <span>Oficio</span>
                        </template>                        
                      </v-radio>
                      <v-radio
                        color="tertiary"
                        value="circular"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <v-icon small left>mdi-text-box-multiple-outline</v-icon>
                          <span>Circular</span>
                        </template>
                      </v-radio>
                      <v-radio
                        color="tertiary"
                        value="memorandum"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <v-icon small left>mdi-sticker-alert-outline</v-icon>
                          <span>Memorandum</span>
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
              :items="departamentos"
              :multiple="multipleDestinatarios"
              :error="errors[0]"
              :btn-copia="!multipleDestinatarios"
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
          <validation-provider name="Asunto" vid="doc.asunto" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="doc.asunto"
              color="purple darken-2"
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
                   <v-chip
                    v-for="(file,i) in anexos"
                    :key="'fileAnexo-'+i"
                    class="mx-2"
                    close
                    color="blue-grey"
                    text-color="white"
                    label
                    large
                  >
                    <!-- <v-avatar rounded left>
                    </v-avatar> -->
                      <v-icon large>mdi-file</v-icon>
                    <span class="px-3" v-text="file.name" />
                  </v-chip>
                </div>
              </div>
            </div>
        </v-col>
        <v-col cols="12">
          <validation-provider name="Contenido" vid="doc.contenido" rules="required" v-slot="{ errors }">
            <ckeditor
              v-model="doc.contenido"
              :editor="editor"
              :config="editorConfig"
            />
          </validation-provider>
        </v-col>
      </v-row>
    </validation-observer>
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
  import { sendDocument, viewDocument } from '@/services/documento'
   import { get } from 'vuex-pathify'

export default {
  name: 'Redactar',
   components: {
    SelectDepartamento: () => import(
      /* webpackChunkName: "select-departamento" */
      './components/SelectDepartamento.vue'
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
    anexos: [],
    copiaShow: false,
    editor: ClassicEditor,
    editorData: '<p>Content of the editor.</p>',
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
  }),
  computed: {
    doc_id: get('route/params@doc'),
    multipleDestinatarios () {
      return this.doc.tipo_documento === 'circular'
    },
    isOficio () {
      return this.doc.tipo_documento === 'oficio'
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
        this.doc.departamentos_destino = this.dataDpto.destino.join(',')
        this.doc.copias = this.dataDpto.copias.length > 0
        this.doc.departamentos_copias = this.dataDpto.copias.length > 0 ? this.dataDpto.copias.join(',') : ''
        this.loading = true
        try {
          const { message } = await sendDocument({ datos: this.doc, status })
           this.$root.$showAlert(message);
           this.$router.push({ name: 'Recibidos' })
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      }
    },

    async getDocumento () {
      this.loading = true
      try {
        const documento = await viewDocument({ id: this.doc_id })
        this.doc.asunto = documento.asunto
        this.doc.contenido = documento.contenido
        this.doc.tipo_documento = documento.tipo_documento
        this.doc.copias = documento?.temporal?.departamentos_copias !== null
        this.dataDpto.destino = documento.temporal.departamentos_destino.split(',').map(item => parseInt(item))
        this.dataDpto.copias = documento.temporal.departamentos_copias !== null
          ? documento.temporal.departamentos_copias.split(',')
          : []

      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    clearInputs (event) {
      this.dataDpto.destino = ''
      this.dataDpto.copias = ''
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

    addAnexo (files) {
      files.forEach(file => {
        this.anexos.push(file)
      })
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
    & button
      border: thin solid #607d8b
      border-radius: 8px !important
      padding: 0 8.4444444444px
      height: 28px
      &.v-icon.v-icon::after
        background-color: transparent !important
  .active-type .v-label, .active-type i
    color: #EE6C4D !important
  
  .ck.ck-editor__main>.ck-editor__editable
    min-height: 200px !important

</style>
