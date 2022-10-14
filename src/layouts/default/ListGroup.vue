<template>
  <v-list-group
    color="white"
    active-class="active-submenu"
    :group="group"
    eager
    v-bind="$attrs"
  >
    <!-- <template v-slot:prependIcon class="mr-0">
      <v-icon class="mr-0 align-self-center" v-text="item.icon" />
    </template> -->
    <template v-slot:activator>
      <v-list-item-icon
        v-if="!item.icon && !item.avatar"
        class="text-caption text-uppercase text-center my-2 align-self-center"
        style="margin-top: 14px"
      >
        {{ title }}
      </v-list-item-icon>
      <v-list-item-icon
        v-else
        class="my-2 mr-4 ml-1 align-self-center"
      >
        <v-icon v-text="item.icon" />
      </v-list-item-icon>

      <v-list-item-avatar v-if="item.avatar">
        <v-img :src="item.avatar" />
      </v-list-item-avatar>

      <v-list-item-content v-if="item.title">
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in item.children">
      <default-list-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
      />

      <default-list-item
        v-if="!child.children"
        :key="`child-${i}`"
        :item="child"
        sub
      />
    </template>
  </v-list-group>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'DefaultListGroup',

    components: {
      DefaultListItem: () => import('./ListItem'),
    },

    props: {
      item: {
        type: Object,
        default: () => ({}),
      },
    },

    computed: {
      gradient: get('user/drawer@gradient'),
      group () {
        return this.genGroup(this.item.children)
      },
      title () {
        const matches = this.item.title.match(/\b(\w)/g)

        return matches.join('')
      },
    },

    methods: {
      genGroup (items) {
        return items.reduce((acc, cur) => {
          if (!cur.to) return acc

          acc.push(
            cur.children
              ? this.genGroup(cur.children)
              : cur.to.slice(1, -1),
          )

          return acc
        }, []).join('|')
      },
    },
  }
</script>
