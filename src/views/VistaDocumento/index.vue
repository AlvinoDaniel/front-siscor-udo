<template>
  <v-container
    id="vista"
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
          Documento
        <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, laudantium quidem. Tempora perferendis eos aspernatur? Neque atque, odio soluta explicabo qui, magni cum rerum, aut culpa exercitationem impedit ratione rem? -->
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  // import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import '@ckeditor/ckeditor5-build-classic/build/translations/es'
  import { get } from 'vuex-pathify'
  import { viewDocument } from '@/services/documento'
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
    id: get('route/params@id'),
  },
  created () {
    this.getDocumento()
  },
  methods: {
    async getDocumento () {
      this.loading = true
      try {
        const { documento } = await viewDocument({ id: this.id })
        console.log(this.id)
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
