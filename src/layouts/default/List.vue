<template>
  <v-list
    expand
    nav
    v-bind="$attrs"
    v-on="$listeners"
    class="px-2"
  >
  <template v-for="(item, i) in items">
      <v-subheader  v-if="item.text" class="text-uppercase" style="height: 28px;">{{item.title}}</v-subheader>
      <default-list-group
        v-if="item.children && item.link"
        :key="`group-${i}`"
        :item="item"
      />

      <default-list-item
        v-if="!item.children && item.link"
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
