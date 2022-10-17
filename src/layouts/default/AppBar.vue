<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    outlined
    class=""
    :color="$vuetify.breakpoint.mobile ? 'primary' : 'white'"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="60"
    flat
  >
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="drawer = !drawer"
    >
      <template slot:default>
        <v-icon color="white">mdi-apps</v-icon>
      </template>
    </v-app-bar-nav-icon>

    <default-drawer-toggle class="hidden-sm-and-down" />

    <!-- <v-toolbar-title
      class="font-weight-light text-h5 hidden-sm-and-down"
      v-text="name"
    /> -->
    <div class="pt-2 hidden-md-and-up">
      <v-img
        :src="require('@/assets/Logos/IDENTIDAD_1.png')"
        max-width="100"
      />
    </div>

    <v-spacer />

    <!-- <default-go-home /> -->

    <!-- <default-notifications /> -->

    <!-- <v-divider inset vertical class="mx-4 my-auto"></v-divider> -->

    <default-account />
  </v-app-bar>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultBar',

    components: {
      DefaultAccount: () => import(
        /* webpackChunkName: "default-account" */
        './widgets/Account'
      ),
      DefaultDrawerToggle: () => import(
        /* webpackChunkName: "default-drawer-toggle" */
        './widgets/DrawerToggle'
      ),
      DefaultGoHome: () => import(
        /* webpackChunkName: "default-go-home" */
        './widgets/GoHome'
      ),
      DefaultNotifications: () => import(
        /* webpackChunkName: "default-notifications" */
        './widgets/Notifications'
      ),
    },

    computed: {
      ...sync('app', [
        'drawer',
        'mini',
      ]),
      name: get('route/name'),
    },
  }
</script>
