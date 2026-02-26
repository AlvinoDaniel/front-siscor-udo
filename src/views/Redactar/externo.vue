<template>
  <v-container
    id="redactar-externo"
    fluid
    tag="section"
    class=""
  >
    <loader-app v-if="loading || loadingDoc" />
    <v-row class="pa-3 mb-3 blue-grey lighten-5 elevation-1">
      <v-col cols="12" class="d-flex align-center justify-space-between py-0">
        <h4 class="font-weight-bold">
          <v-icon left @click="$router.go(-1)">
            mdi-arrow-left
          </v-icon>
          Registrar Documento Externo
        </h4>
        <div
          v-if="!loadingDoc"
          class="d-flex"
          style="gap:1rem"
        >
          <div>
            <v-checkbox
              v-model="doc.responder"
              label=""
              color="secondary"
              :value="1"
              :false-value="0"
              hide-details
              active-class="active-type font-weight-bold"
              class="mt-0"
            >
              <template v-slot:label>
                <span class="font-weight-medium black--text pb-1">
                  Requiere Respuesta
                </span>
              </template>
            </v-checkbox>
          </div>
          <v-btn
            small
            depressed
            color="secondary"
            class="rounded-lg"
            @click="saveDocument('enviar')"
          >
            <v-icon left>mdi-text-box-check-outline</v-icon>
            Registrar
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <validation-observer ref="WRITE_FORM">
      <v-row class="py-4 px-6">
        <v-col cols="12" class="py-0 d-flex justify-space-between align-center">
          <validation-provider name="Tipo de Documento" vid="doc.tipo_remitente" rules="required" v-slot="{ errors }">
            <div class="input-redactar theme--light d-flex align-self-center">
              <div class="v-input__control">
                <div class="v-input__slot">
                  <div class="v-input__prepend-inner">
                    <span class="pr-2 pt-1"> Tipo de Remitente: </span>
                  </div>
                    <v-radio-group
                      v-model="doc.tipo_remitente"
                      hide-details
                      row
                      class="mt-0 pt-0"
                      active-class="active-type font-weight-bold"
                      @change="resetDataRemitente"
                    >
                      <v-radio
                        color="secondary"
                        value="FUNC"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <div class="pb-1">
                            <v-icon small class="mr-1">mdi-account-tie-outline</v-icon>
                            <span>Funcionario</span>
                          </div>
                        </template>
                      </v-radio>
                      <v-radio
                        color="secondary"
                        value="PA-IN"
                        on-icon="mdi-check-circle-outline"
                      >
                        <template v-slot:label>
                          <div class="pb-1">
                            <v-icon small class="mr-1">mdi-book-account-outline</v-icon>
                            <span>Particular/Institución</span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                </div>
              </div>
            </div>
          </validation-provider>
          <v-btn-toggle
            v-model="doc.important"
            rounded
            color="red"
            dense
            background-color="transparent"
          >
            <v-btn small class="px-4" :value="1" color="blue-grey" outlined>
              <v-icon v-if="doc.important === 1" color="red" left>mdi-pin mdi-rotate-45</v-icon>
              <v-icon v-else color="blue-grey" left>mdi-pin-outline mdi-rotate-45</v-icon>
              Marcar como Importante
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12">
          <h4 class="blue-grey--text">Remitente</h4>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
          <validation-provider name="Documento de Identidad" vid="doc.documento_remitente" rules="required" v-slot="{ errors }">
            <v-autocomplete
              v-if="isFuncionario"
              v-model="dataPersonal"
              :items="personal"
              :search-input.sync="cedulaSearch"
              item-text="cedula_identidad"
              label="Cédula de Identidad"
              placeholder="Buscar"
              prepend-inner-icon="mdi-account-search"
              return-object
              class="input-redactar"
              :error-messages="errors[0]"
              @change="assignPersonal"
            >
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                  <v-list-item-content>
                    <v-list-item-title v-text="`${data.item.cedula_identidad} - ${data.item.nombres}`"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
              <template v-slot:label>
                <span class="px-2 text-label">
                  Documento de Identidad:
                </span>
              </template>
            </v-autocomplete>
            <v-text-field
              v-else
              v-model="doc.documento_remitente"
              label=""
              class="input-redactar"
              prepend-inner-icon="mdi-card-account-details-outline"
              :error-messages="errors[0]"
              placeholder="Ejemplo V-00000000"
              v-mask="identityMask"
            >
              <template v-slot:label>
                <span class="px-2 text-label">
                  Documento de Identidad:
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12" md="8" class="py-0">
          <validation-provider name="Remitente" vid="doc.remitente" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="doc.remitente"
              class="input-redactar"
              label=""
              prepend-inner-icon="mdi-playlist-edit"
              :error-messages="errors[0]"
            >
              <template v-slot:label>
                <span class="px-2 text-label">
                  Nombre del Remitente:
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
          <validation-provider name="Correo Electrónico" vid="doc.email_remitente" rules="required|email" v-slot="{ errors }">
            <v-text-field
              v-model="doc.email_remitente"
              class="input-redactar"
              :error-messages="errors[0]"
              prepend-inner-icon="mdi-email-edit-outline"
              label=""
            >
              <template v-slot:label>
                <span class="px-2 text-label">
                  Correo Electrónico:
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12" md="4" class="py-0">
          <validation-provider name="Teléfono de Contácto" vid="doc.telefono_remitente" rules="" v-slot="{ errors }">
            <v-text-field
              v-model="doc.telefono_remitente"
              class="input-redactar"
              :error-messages="errors[0]"
              prepend-inner-icon="mdi-phone-outline"
              label=""
              v-mask="'####-#######'"
              placeholder="Ejemplo 0000-0000000"
            >
              <template v-slot:label>
                <span class="px-2 text-label">
                  Teléfono de Contácto:
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12">
          <h4 class="blue-grey--text">Datos del Oficio</h4>
        </v-col>
        <v-col cols="12" class="py-0 d-flex">
          <validation-provider name="" vid="tieneNumero" rules="" v-slot="{ errors }">
            <v-checkbox
            v-model="tieneNumero"
            label=""
            color="secondary"
            :value="true"
            false-value="false"
            hide-details
            active-class="active-type font-weight-bold"
            class="mt-0"
            @change="changeNumber"
          >
            <template v-slot:label>
              <span class="pb-1 text-label">
                Tiene Número <span v-if="doc.nro_doc !== ''">:</span>
              </span>
            </template>
          </v-checkbox>
          </validation-provider>
          <div v-if="doc.nro_doc !== ''" class="d-flex align-center mx-4">
            <span class="font-weight-bold text-uppercase">{{doc.nro_doc}}</span>
            <v-btn outlined small class="mx-3" color="blue-grey" @click="editNumber">
              <v-icon left>mdi-pencil</v-icon> Editar
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="9" class="pb-0">
          <validation-provider name="Asunto" vid="doc.asunto" rules="max:191" v-slot="{ errors }">
            <v-text-field
              v-model="doc.asunto"
              class="input-redactar"
              prepend-inner-icon="mdi-playlist-edit"
              :error-messages="errors[0]"
              label=""
            >
              <template v-slot:label>
                <span class="px-2 text-label">
                  Asunto
                </span>
              </template>
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12" md="3" class="pb-0">
          <validation-provider name="Fecha del Oficio" vid="doc.fecha_emision" rules="required" v-slot="{ errors }">
            <v-menu
              v-model="showDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateSelected"
                  prepend-inner-icon="mdi-calendar-check"
                  label=""
                  v-bind="attrs"
                  v-on="on"
                  readonly
                  >
                  <template v-slot:label>
                    <span class="px-2 text-label">
                      Fecha del Oficio:
                    </span>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="doc.fecha_emision"
                no-title
                @input="showDate = false"
                @change="parseDate()"
              ></v-date-picker>
            </v-menu>
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <div class="input-redactar theme--light d-flex align-self-center">
            <div class="v-input__control">
              <div class="v-input__slot pb-0 justify-space-between">
                <div class="v-input__prepend-inner">
                  <span class="px-2 pt-1">Contenido: </span>
                </div>
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
    <number-doc
      v-model="showNumberDoc"
      :doc-number="doc.nro_doc"
      :action="actionNumbre"
      @register="actionRegisterNumber"
    ></number-doc>
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

  import { searchPersonal, sendDocument } from '@/services/externo'
  import { get } from 'vuex-pathify'
  import moment from 'moment';



export default {
  name: 'Redactar',
   components: {
    NumberDoc: () => import(
      /* webpackChunkName: "select-departamento" */
      './components/NumberDoc.vue'
    ),
  },
  data: () => ({
    doc: {
      contenido: '',
      responder: 0,
      documento_remitente: '',
      remitente: '',
      email_remitente: '',
      telefono_remitente: '',
      fecha_emision: '',
      nro_doc: '',
      asunto: '',
      important: 0,
      tipo_remitente: 'FUNC'
    },
    tipo_remitente: 'funcionario',
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
    identifications: ['V', 'E', 'J', 'G'],
    identityMask: [/[VvEeJjGg]/, '-', /\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
    personal:[],
    dataPersonal: null,
    cedulaSearch: '',
    showDate: false,
    dateSelected: null,
    tieneNumero: 0,
    showNumberDoc: false,
    actionNumbre: 'crear'
  }),
  computed: {
    responseData: get('route/query@r'),
    isFuncionario(){
      return this.doc.tipo_remitente === 'FUNC';
    }
  },
  watch:{
    cedulaSearch(val) {
      val && val !== this.doc.documento_remitente && this.querySelections(val)
    },
    selected_date (val, oldVal) {
      if(val === oldVal) return

      this.doc.fecha_emision = val != '' ? moment(val).format('YYYY-MM-DD') : val
    }
  },
  created () {
    if(this.responseData)
      this.assignResponse()
  },
  methods: {
    async querySelections (cedula) {
      try {
        this.personal = await searchPersonal({cedula})
      } catch (error) {
        console.log(error)
      }
    },
    assignPersonal () {
      if(this.dataPersonal) {
        const {cedula_identidad, nombres, correo } = this.dataPersonal

        this.doc.documento_remitente = cedula_identidad
        this.doc.remitente = nombres
        this.doc.email_remitente = correo
      }
    },
    verificate () {
      if(typeof this.dataPersonal === 'object' && this.cedulaSearch === ''){
        this.dataPersonal = null
      }
    },
    async saveDocument (status) {
      const valid = await this.$refs.WRITE_FORM.validate()
      if (valid) {
        this.loading = true
        try {
          const { message } = await sendDocument({
            datos: {
              ...this.doc,
              nro_doc: this.doc.nro_doc !== '' ? this.doc.nro_doc : undefined
            }
          })

            this.$root.$showAlert(message, 'success')
            this.$router.push({ name: 'Externos' })
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      } else {
        this.$refs.contenido.setFlags({ touched: true })
      }
    },
    parseDate(){
      this.dateSelected = moment(this.doc.fecha_emision).format('DD MMM YYYY');
    },
    resetDataRemitente(){
      this.doc.remitente = '';
      this.doc.email_remitente = '';
      this.doc.documento_remitente = '';
      this.dataPersonal = null
    },
    actionRegisterNumber(nu_doc){
      console.log({nu_doc})
      if(nu_doc === null) {
        this.tieneNumero = false
        return
      }
      this.doc.nro_doc = nu_doc
    },
    editNumber(){
      this.actionNumbre = 'edit'
      this.showNumberDoc = true
    },
    changeNumber(e){
      if(e){
        this.showNumberDoc = true;
        return
      }

      this.doc.nro_doc = ''
    }


  },
}

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

  .text-label
    color: #78909c !important
    caret-color: #78909c !important
    font-weight: 500 !important

  .active-type .v-label, .active-type i
    color: #2DB2D5 !important
    font-weight: 500 !important

  .ck.ck-editor__main>.ck-editor__editable
    min-height: 200px !important

  .invalid .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)
    border-color: #ff5252 !important

</style>
