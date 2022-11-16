<template>
  <div>
    <v-chip
      v-for="(file,i) in anexos"
      :key="'fileAnexo-'+i"
      :disabled="file.loader"
      class="mx-2 mb-2 label-anexo "
      :close="!file.loader"
      color="cyan lighten-4 rounded-lg"
      text-color="light-blue darken-4"
      label
      large
      @click:close="deleteFile(i)"
    >
    <v-avatar size="121" rounded color="cyan lighten-5">
      <v-icon small color="blue">mdi-file</v-icon>
    </v-avatar>
    <span class="px-3" v-text="file.file.name" />
    <v-progress-circular
      v-if="file.loader"
        indeterminate
        size="20"
        color="blue accent-2"
        class="mx-auto"
      />
  </v-chip>
  </div>
</template>
<script>
export default {
  name: 'ListAnexos',
  props: {
    anexos: {
      type: Array,
      default: () => ([]),
    },
    modeDoc: {
      type: String,
      default: 'oficio',
    },
  },
  data: () => ({

  }),
  methods: {
    deleteFile (index) {
      this.$emit('delete', index)
    },
  }
}
</script>
<style>
.label-anexo .v-avatar {
  height: 30px !important;
   min-width: 30px !important;
  width: 30px !important;
}
</style>
