<template>
  <div>
    <v-chip
      v-for="(file,i) in anexos"
      :key="'fileAnexoDescarga-'+i"
      class="mx-2 label-anexo"
      color="grey lighten-4 rounded-lg"
      text-color="light-blue darken-4"
      label
      large
    >
    <v-avatar rounded color="grey lighten-3">
      <v-icon small color="blue">mdi-file</v-icon>
    </v-avatar>
    <span class="px-3" v-text="file.file.nombre" />
    <v-btn v-if="!file.loader" small icon text @click="downloadFile(i)">
      <v-icon color="secondary" >mdi-download</v-icon>
    </v-btn>
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
  },
  data: () => ({

  }),
  methods: {
    downloadFile (index) {
      this.$emit('download', index)
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
