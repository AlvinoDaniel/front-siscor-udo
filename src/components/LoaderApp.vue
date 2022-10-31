<template>
  <v-overlay
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
        <h5
          v-if="text !== null"
          class="blue-grey--text mt-2 text-center"
          v-text="text"
        />
      </div>
    </v-overlay>
</template>
<script>
export default {
  name: 'LoaderApp',
  props: {
    text: {
      type: String,
      default: null,
    },
  },
}
</script>
