<template>
  <v-row>
      <v-col cols="6" sm="7" class="d-flex align-center">
        <span 
          class="font-weight-bold" 
          :class="{'text-h3': $vuetify.breakpoint.smAndUp, 'text-h4': $vuetify.breakpoint.xsOnly,}" 
          v-text="name" 
        />
        <template v-if="subHeader">
          - <span class="display-1 primary--text" v-text="subHeader"></span>
        </template>
      </v-col>
      <v-col cols="6" sm="5" class="text-right">
        <slot name="actionsMain"></slot>
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left-bold-box</v-icon>
        </v-btn>
      </v-col>
    </v-row>
</template>
<script>
import { get } from 'vuex-pathify'
export default {
  name: 'MainHeader',
  props:{
    subHeader: String
  },
  computed:{
    name: get('route/name'),
  }
}
</script>