<template>
  <v-list-item class="justify-space-between pl-1 pb-2" style="background-color: rgba(103,102,136,0.08)">
    <v-list-item-avatar class="py-1" v-if="mini">
      <v-expand-x-transition>
        <v-img
          :src="
            require('@/assets/Logos/ICONO_IDENTIDAD_192X192.png')"
          width="120"
        />
      </v-expand-x-transition>
    </v-list-item-avatar>

    <v-list-item-content
      v-else
      class="pl-2 pb-0"
    >
      <v-list-item-title class="text-h4 d-flex align-center">
        <v-img
          :src="require('@/assets/Logos/ICONO_IDENTIDAD_192X192.png')"
          contain
          max-width="40"
        />
        <div class="d-flex flex-column ml-2">
          <div>
            <span class="text-h4 secondary--text font-weight-bold">SISCOR</span>
            <span class="text-h4 label--text font-weight-black">UDO</span>
          </div>
          <span class="label--text flex-grow-1" style="font-size: 0.5rem;">SISTEMA DE CORRESPONDENCIA</span>
        </div>


        <!-- <span class="primary--text">FREE</span> -->
      </v-list-item-title>
    </v-list-item-content>
    <!-- <v-list-item-action v-if="!mini && !$vuetify.breakpoint.mobile">
      <v-btn
        icon
        small
        color="white"
         @click="mini = !mini"
         class="white--text"
      >
        <v-icon>mdi-backburger</v-icon>
      </v-btn>
    </v-list-item-action> -->
  </v-list-item>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawerHeader',

    computed: {
      version: get('app/version'),
      name: get('route/name'),
      mini: sync('app/mini'),
    },
  }
</script>
