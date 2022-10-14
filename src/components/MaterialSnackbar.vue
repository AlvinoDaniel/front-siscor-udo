<template>
  <v-snackbar
    v-model="internalValue"
    class="v-snackbar--material"
    app
    multi-line
    elevation="24"
    v-bind="{
      ...$attrs,
      'color': 'white'
    }"
    transition="slide-x-transition"
    bottom
    right
  >
    <material-alert
      v-model="internalValue"
      :color="type"
      :icon="$attrs.icon ? $attrs.icon : iconType"
      :dismissible="dismissible"
      class="ma-0"
    >
      <slot />
    </material-alert>
  </v-snackbar>
</template>

<script>
  export default {
    name: 'MaterialSnackbar',

    props: {
      dismissible: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: '',
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

    computed:{
      iconType(){
        const icons = {
          success: 'mdi-shield-check',
          error: 'mdi-close-octagon',
          warning: 'mdi-alert-circle'
        };

        return icons[this.type];
      }
    }
  }
</script>

<style lang="sass">
  .v-snackbar--material
    margin-top: 32px
    margin-bottom: 32px

    .v-alert
      padding: 20px 16px

    .v-alert--material,
    .v-snack__wrapper
      border-radius: 4px

    .v-snack__content
      overflow: visible
      padding: 0

    .v-snack__action
      display: none
</style>
