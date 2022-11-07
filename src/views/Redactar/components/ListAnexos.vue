<template>
  <div>
    <v-chip
      v-for="(file,i) in anexos"
      :key="'fileAnexo-'+i"
      class="mx-2"
      close
      color="blue-grey rounded-lg"
      text-color="white"
      label
      large
      @click:close="deleteFile(i)"
    >
        <v-icon large>mdi-file</v-icon>
      <span class="px-3" v-text="file.name" />
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
