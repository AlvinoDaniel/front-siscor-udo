<template>
  <v-row align="center">
    <v-col cols="12">
      <v-skeleton-loader
      type="list-item, table-heading"
    />
      <v-skeleton-loader
      class="doc-loader"
      type="image"
    />
    </v-col>
  </v-row>
</template>
<script>
  name: 'LoaderDoc'
</script>
<style>
.doc-loader .v-skeleton-loader__image {
  height: 50vh !important;
}
</style>
