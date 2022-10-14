<template>
  <v-alert
    class="v-alert--material"
    v-bind="$attrs"
    v-on="$listeners"
    border="left"
  >
    <template
      v-if="$attrs.icon"
      v-slot:prepend
    >
      <v-avatar
        class="align-self-start mr-4"
        size="38"
      >
        <v-icon
          class="elevation-6"
          dark
          large
        >
          {{ $attrs.icon }}
        </v-icon>
      </v-avatar>
    </template>

    <slot />

    <template
      v-if="$attrs.dismissible"
      v-slot:close="{ toggle }"
    >
      <v-btn
        :aria-label="$vuetify.lang.t('$vuetify.close')"
        class="ml-4"
        color
        icon
        small
        @click="toggle"
      >
        <v-icon>
          $vuetify.icons.cancel
        </v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script>
  export default { name: 'MaterialAlert' }
</script>

<style lang="sass">
  .v-alert--material
    margin-top: 32px

    .v-alert__dismissible
      align-self: flex-start
      margin: 0 0 0 16px !important
</style>
