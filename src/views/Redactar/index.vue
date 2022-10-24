<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <v-overlay
      v-if="loading"
      :value="true"
      color="white"
      absolute
      opacity="0.9"
      style="z-index: 2 !important"
    >
      <div class="d-flex flex-column justify-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="label"
          class="mx-auto"
        />
      </div>
    </v-overlay>
    <v-row>
      <v-col cols="12" class="pa-4">
        <h4 class="font-weight-bold">
          Redactar
        <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, laudantium quidem. Tempora perferendis eos aspernatur? Neque atque, odio soluta explicabo qui, magni cum rerum, aut culpa exercitationem impedit ratione rem? -->
        </h4>
      </v-col>
    </v-row>
    <validation-observer ref="WRITE_FORM">
      <v-row class="pa-3">
        <v-col cols="12" class="py-0">
          <validation-provider name="Asunto" vid="doc.asunto" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="doc.asunto"
              color="purple darken-2"
              label="Asunto"
              :error-messages="errors[0]"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Enviar" vid="dataDpto.destino" rules="required" v-slot="{ errors }">
            <v-autocomplete
              v-model="dataDpto.destino"
              :items="departamentos"
              no-data-text="No hay registros que coincidan"
              placeholder=""
              multiple
              item-color="label"
              label="Enviar"
              item-text="nombre"
              item-value="id"
              :error-messages="errors[0]"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Copias" vid="dataDpto.copias" rules="" v-slot="{ errors }">
            <v-autocomplete
              v-model="dataDpto.copias"
              :items="departamentos"
              no-data-text="No hay registros que coincidan"
              placeholder=""
              multiple
              item-color="label"
              :loading="loading"
              label="Copias"
              item-text="nombre"
              item-value="id"
              :disabled="dataDpto.destino.length > 1"
              :error-messages="errors[0]"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Tipo de Documento" vid="doc.tipo_documento" rules="required" v-slot="{ errors }">
            <v-select
              v-model="doc.tipo_documento"
              :items="['oficio', 'circular', 'memorandum']"
              no-data-text="No hay registros que coincidan"
              placeholder=""
              label="Tipo de Documento"
              item-text=""
              item-color="label"
              :error-messages="errors[0]"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="py-0">
          <validation-provider name="Contenido" vid="doc.contenido" rules="required" v-slot="{ errors }">
            <ckeditor
              v-model="doc.contenido"
              :editor="editor"
              :config="editorConfig"
            />
            <!-- <small>{{errors[0]}}</small> -->
          </validation-provider>
        </v-col>
      </v-row>
    </validation-observer>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="saveDocument('enviar')" depressed color="secondary" class="mx-2">
          Enviar
        </v-btn>
        <v-btn @click="saveDocument('corregir')" depressed color="info" class="mx-2">
          Por Corregir
        </v-btn>
        <v-btn @click="saveDocument('borrador')" depressed color="info" class="mx-2">
          Guardar como borrador
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  // import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import '@ckeditor/ckeditor5-build-classic/build/translations/es'
  import { getDepartamentoList } from '@/services/departamento'
  import { sendDocument, viewDocument } from '@/services/documento'
   import { get } from 'vuex-pathify'

export default {
  name: 'Redactar',
  data: () => ({
    doc: {
      asunto: '',
      contenido: '',
      tipo_documento: '',
      departamentos_destino: '',
      departamentos_copias: '',
      copias: false,
      estatus: '',
    },
    dataDpto: {
      destino: [],
      copias: [],
    },
    editor: ClassicEditor,
    editorData: '<p>Content of the editor.</p>',
    editorConfig: {
      language: 'es',
      // plugins: [Alignment],
      toolbar: {
        items: [
          'heading', '|',
          'fontfamily', 'fontsize', '|',
          'alignment', '|',
          'fontColor', 'fontBackgroundColor', '|',
          'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
          'outdent', 'indent', '|',
          'bulletedList', 'numberedList', '|',
          'undo', 'redo',
        ],
        shouldNotGroupWhenFull: true
      },
    },
    departamentos: [],
    loading: false,
  }),
  computed: {
    doc_id: get('route/params@doc'),
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
        console.log(documento)
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
  },
}
// E2E7F1
</script>
