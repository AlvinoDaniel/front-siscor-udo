// Vuetify Documentation https://vuetifyjs.com

import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import ripple from 'vuetify/lib/directives/ripple'
import '@mdi/font/css/materialdesignicons.min.css'
import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify, { directives: { ripple } })

const theme = {
  // primary: '#164360',
  primary: '#3D5A80',
  // secondary: '#63B041',
  secondary: '#2DB2D5',
  tertiary: '#EE6C4D',
  sidebar: '#F5F8FA',
  accent: '#323D4B',
  info: '#00CAE3',
  success: '#2CC09C',
  warning: '#FB8C00',
  error: '#FF5252',
  label: '#676688',
  icono: '#2CC09C',
}

export default new Vuetify({
  lang: {
    locales: { es },
    current: 'es',
  },
  breakpoint: { mobileBreakpoint: 960 },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
  iconfont: 'mdi',
})
