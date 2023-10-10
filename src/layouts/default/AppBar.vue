<template>
  <v-app-bar
    id="default-app-bar"
    app
    class="white-bar"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="60"
    flat
    fixed
  >
    <!-- :color="$vuetify.breakpoint.mobile ? 'primary' : 'white'" -->
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="drawer = !drawer"
    >
      <template slot:default>
        <v-icon>mdi-apps</v-icon>
      </template>
    </v-app-bar-nav-icon>

    <default-drawer-toggle class="hidden-sm-and-down" />

    <!-- <v-toolbar-title
      class="font-weight-light text-h5 hidden-sm-and-down"
      v-text="name"
    /> -->
    <v-btn
      color="blue-grey lighten-1"
      dark
      depressed
      outlined
      rounded
      small
      class="text-capitalize py-4 pl-1"
      style="background-color: #fafafa; font-size: 0.8rem !important;"
      :to="{name: 'Redactar'}"
    >
      <v-avatar color="tertiary" size="20" class="mr-2">
        <v-icon color="white" size="18">mdi-plus</v-icon>
      </v-avatar>
      Crear documento
    </v-btn>
    <div class="pt-1 hidden-md-and-up">
      <v-img
        :src="require('@/assets/Logos/IDENTIDAD_1.png')"
        max-width="120"
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
<style>
.white-bar {
  background-color: #FFFFFF !important;
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
