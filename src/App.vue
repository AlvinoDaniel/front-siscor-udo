<template>
  <v-app>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
    <default-overlay />
  </v-app>
</template>

<script>
  // Styles
  import '@/styles/overrides.sass'
  import '@/styles/PlusJakartaSans.css'

  export default {
    name: 'App',
    metaInfo: {
      title: 'App',
      titleTemplate: '%s | SISCOR-UDO',
      htmlAttrs: { lang: 'eS' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
    components:{
      DefaultOverlay: () => import(
        /* webpackChunkName: "default-overlay" */
        './layouts/default/AppOverlay'
      ),
    }
  }
</script>
