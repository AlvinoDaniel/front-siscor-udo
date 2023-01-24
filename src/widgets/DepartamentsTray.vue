<template>
  <v-dialog
    v-model="show"
    width="600"
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5 primary--text grey lighten-5 font-weight-bold">
        Departamentos Enviados
        <v-spacer />
        <v-btn
          icon
          color="label"
          small
          @click="show = false"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col v-if="leidos.length > 0" cols="12" class="px-0">
            <v-list two-line>
              <h5 class="pl-1 icono--text">
                <v-icon
                size="19"
                class="px-6 mt-n1"
                color="icono"
                v-text="'mdi-check-all'"
              />
                Leidos
              </h5>
              <template v-for="(item, index) in leidos">
                <v-list-item class="">
                  <v-list-item-avatar>
                    <v-avatar
                      color="indigo"
                      size="30"
                    >
                      <span
                        class="white--text font-weight-bold text-4"
                        v-text="item.siglas || toInitials(item.nombre)"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      <span v-text="item.nombre" />
                    </v-list-item-title>
                    <v-list-item-subtitle v-text="item.jefe" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      {{ item.fecha_leido | smartDate }}
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
          </v-col>
          <v-col cols="12" class="px-0">
            <v-list v-if="noLeido.length > 0" two-line>
              <h5 class="px-6 mt-n1">Recibidos</h5>
              <template v-for="(item, index) in noLeido">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar
                      color="indigo"
                      size="40"
                    >
                      <span
                        class="white--text font-weight-bold text-4"
                        v-text="item.siglas || toInitials(item.nombre)"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      <span v-text="item.nombre" />
                    </v-list-item-title>
                    <v-list-item-subtitle v-text="item.jefe" />
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  import { getInitals } from '@/util/helpers'

  export default {
    name: 'ListDepartamentsSend',
    props: {
      value: Boolean,
      items: {
        type: Array,
        default: () => {[]}
      },
      copias:{
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        show: this.value,
        selected: 0
      }
    },
    computed: {
      leidos () {
        return this.items.length > 0
          ? this.items.filter(dpto => dpto?.leido === 1)
          : []
      },
      noLeido () {
        return this.items.length > 0
          ? this.items.filter(dpto => dpto?.leido === 0)
          : []
      },
      copiasItems () {
        return this.items.length > 0
          ? this.items.filter(dpto => dpto?.copia === 1)
          : []
      },
    },
    watch: {
      show (val, oldVal) {
        if (val === oldVal) return

        this.$emit('input', val)
      },
      value (val, oldVal) {
        if (val === oldVal) return

        this.show = val
      },
    },
    methods: {
      toInitials: getInitals,
    }
  }
</script>
