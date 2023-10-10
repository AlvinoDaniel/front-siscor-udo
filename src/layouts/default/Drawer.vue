<template>
  <v-navigation-drawer
    id="default-drawer"
    v-model="drawer"
    :mini-variant.sync="mini"
    mini-variant-width="80"
    app
    width="250"
    color="sidebar"
    class="elevation-3"
  >
    <div class="px-2">
      <default-drawer-header />

      <v-divider class="mx-3 light divider-menu" />

      <!-- <v-list nav class="py-0">
        <v-list-item class="py-1 lighten-4">
          <v-list-item-content>
              <v-btn
                color="blue-grey lighten-1"
                dark
                depressed
                outlined
                rounded
                small
                class="text-capitalize"
                :to="{name: 'Redactar'}"
              >
                <v-avatar color="tertiary" size="20" class="mr-2">
                  <v-icon color="white" size="18">mdi-plus</v-icon>
                </v-avatar>
                Crear documento
              </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->

      <default-list :items="items" />
    </div>

    <template #append>
      <v-list nav>
        <v-list-item link class="py-1 lighten-4" @click="handleLogout">
          <v-list-item-icon class="my-2 ml-4 align-self-center">
            <v-icon color="tertiary">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>SALIR</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <div class="pt-12" />
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import { get, sync, call } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawer',

    components: {
      DefaultDrawerHeader: () => import(
        /* webpackChunkName: "default-drawer-header" */
        './widgets/DrawerHeader'
      ),
      DefaultList: () => import(
        /* webpackChunkName: "default-list" */
        './List'
      ),
    },

    methods:{
      logout: call('user/logout'),
      handleLogout(){
        this.logout().then(() => {
          this.$router.replace({ path: '/auth/login/'});
        });
      }
    },
    computed: {
      ...get('app', [
        'items',
        'version',
      ]),
      ...sync('app', [
        'drawer',
        'drawerImage',
        'mini',
      ]),
    },
  }
</script>

<style lang="sass">
#default-drawer
  .v-list-item
    margin-bottom: 2px

  .v-list-item:not(.v-list-item--active), .v-list-item:not(.v-list-item--active, .sub) .theme--light.v-icon
    color: #676688 !important

  .v-list-item:not(.v-list-item--active) a:hover
    color:#000

  .v-list-item:not(.v-list-item--active).sub .theme--light.v-icon
    color: #fff !important

  .v-list-item::before,
  .v-list-item::after
    display: none

  .v-list-group__header__prepend-icon,
  .v-list-item__icon
    margin-top: 12px
    margin-bottom: 12px
    margin-left: 2px

  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

.divider-menu
  border-color: rgba(255, 255, 255, 0.22) !important
</style>
