<template>
  <v-snackbar
    :value="internalValue"
    :timeout="-1"
    app
    color="primary"
    elevation="24"
    class="py-3"
    v-bind="$attrs"
    transition="slide-x-transition"
    bottom
    right
  >
    <div class="d-flex align-center"> 
      <v-icon v-if="icon" left dark v-text="icon" />
      <span
        v-text="text"
      />
    </div>
    <v-progress-linear
      indeterminate
      color="icono"
      class="mt-3"
    />
  </v-snackbar>
</template>

<script>
  export default {
    name: 'MaterialWait',

    props: {
      text: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: null,
      },
      value: Boolean,
    },

    data () {
      return {
        internalValue: this.value,
      }
    },

    watch: {
      internalValue (val, oldVal) {
        if (val === oldVal) return

        this.$emit('input', val)
      },
      value (val, oldVal) {
        if (val === oldVal) return

        this.internalValue = val
      },
    },
  }
</script>

