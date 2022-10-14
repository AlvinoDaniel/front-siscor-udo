<template>
  <div>
    <default-bar />

    <default-drawer  />

    <default-view  />

    <default-confirm ref="DialogConfirm" />

    <alert-global ref="alertGlobal" />

  </div>
</template>

<script>
import DefaultConfirm from '@/widgets/DialogConfirm'
  export default {
    name: 'DefaultLayout',

    mounted() {
      this.$root.$showAlert = this.$refs.alertGlobal.show;
      this.$root.$confirm = this.$refs.DialogConfirm.open;
    },

    components: {
      DefaultBar: () => import(
        /* webpackChunkName: "default-app-bar" */
        './AppBar'
      ),
      DefaultDrawer: () => import(
        /* webpackChunkName: "default-drawer" */
        './Drawer'
      ),
      DefaultView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
      DefaultConfirm,
    },
  }
</script>
