<template>
  <v-list
    expand
    nav
    v-bind="$attrs"
    v-on="$listeners"
    class="px-2"
  >
    <v-subheader class="pl-0 pb-0" style="height: 28px;">Bandejas</v-subheader>
    <template v-for="(item, i) in items">
      <default-list-group
        v-if="item.children"
        :key="`group-${i}`"
        :item="item"
      />

      <default-list-item
        v-else
        :key="`item-${i}`"
        :item="item"
      />
      <v-divider v-if="item.divider" class="mx-3 mb-2 divider-menu" :key="`itemd-${i}`" />
    </template>
  </v-list>
</template>

<script>
  export default {
    name: 'DefaultList',

    components: {
      DefaultListGroup: () => import('./ListGroup'),
      DefaultListItem: () => import('./ListItem'),
    },

    props: {
      items: {
        type: Array,
        default: () => ([]),
      },
    },
  }
</script>
