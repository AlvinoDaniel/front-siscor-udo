<template>
 <v-row
   class="grey lighten-5 rounded-xs"
   v-bind="$attrs"
 >
    <v-col
      cols="12"
      class="d-flex justify-space-between"
    >
      <img
        :src="require(`@/assets/Logos/${logotipo}.png`)"
        width="150"
      >
      <div class="d-flex flex-column justify-center align-end blue-grey--text caption">
        <span> <strong> Usuario: </strong> {{ basic.username }}</span>
        <span><strong>Fecha:</strong> {{ dateScreenshot | FullDate }}</span>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import { get } from 'vuex-pathify'
import moment from 'moment'

const getName = (file) => {
  const [name, ext] = file.slice(2).split('.')
  return name.toLowerCase()
}

const hasImage = (logo) => {
  const folderImages = require.context('@/assets/Logos', true, /\.png$/)
  const IMAGES = folderImages.keys().map(file => getName(file))
  return IMAGES.some(image => image.includes(logo.toLowerCase()))
}

export default {
  name: 'HeaderScreenshot',
  computed: {
    basic: get('user/infoBasic'),
    dateScreenshot () {
      return moment()
    },
    logotipo () {
      return this.basic.sucursal && hasImage(this.basic.sucursal) 
        ? this.basic.sucursal
        : 'IDENTIDAD'
    },
  },
}
</script>