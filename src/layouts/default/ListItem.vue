<template>
  <v-list-item
    :href="item.href"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    :to="item.to"
    active-class="active-menu secondary--text font-weight-bold"
    link
    class="py-1"
    :class="{'sub': sub}"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon
      v-if="!item.icon"
      class="text-caption text-uppercase justify-center mx-1 my-2 align-self-center"
    >
      {{ title }}
    </v-list-item-icon>

    <v-list-item-avatar v-if="item.avatar">
      <v-img :src="item.avatar" />
    </v-list-item-avatar>

    <v-list-item-icon
      v-if="item.icon"
      class="my-2 mr-4 align-self-center"
      :class="{'ml-5': sub && !mini , 'ml-1': !sub || mini}"
    >
      <v-icon color="secondary" v-text="item.icon" />
    </v-list-item-icon>

    <v-list-item-content v-if="item.title">
      <v-list-item-title v-text="item.title" />
    </v-list-item-content>
    <v-list-item-action v-if="item.meta && item.meta.badge !== null && item.meta.badge > 0">
      <v-chip class="chip-small" label color="tertiary" dark v-text="item.meta.badge" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultListItem',

    props: {
      item: {
        type: Object,
        default: () => ({}),
      },
      sub: {
        type: Boolean,
        default: () => (false),
      },
    },

    computed: {
      mini: get('app/mini'),
      title () {
        const matches = this.item.title.match(/\b(\w)/g)

        return matches.join('')
      },
    },
  }
</script>
<style>
.chip-small {
  border-radius: 12px;
  font-size: 11px !important;
  font-weight: 300;
  height: 17px !important;
  padding: 6px !important;
}
</style>
