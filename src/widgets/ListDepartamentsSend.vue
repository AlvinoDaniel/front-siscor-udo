<template>
  <v-dialog
    v-model="show"
    width="600"
  >
    <v-card>
      <v-card-title class="text-h5 primary--text grey lighten-5">
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
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="selected" color="icono">
              <v-tab class="text-subtitle">Leidos por</v-tab>
              <v-tab class="text-subtitle">Recibido por</v-tab>
            </v-tabs>
            <v-divider />
            <v-tabs-items v-model="selected">
              <v-tab-item>
                <v-list v-if="leidos.length > 0" two-line>
                  <template v-for="(item, index) in leidos">
                    <v-list-item class="px-0">
                      <v-list-item-avatar>
                        <v-avatar
                          color="indigo"
                          size="40"
                        >
                          <span
                            class="white--text font-weight-bold text-4"
                            v-text="item.siglas || ''"
                          />
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          <span v-text="item.nombre" />
                        </v-list-item-title>
                        <v-list-item-subtitle v-text="item.jefe.nombres_apellidos" />
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider
                      v-if="index < items.length - 1"
                      :key="index"
                    ></v-divider>
                  </template>
                </v-list>
              </v-tab-item>
              <v-tab-item>
                <v-list v-if="noLeido.length > 0" two-line>
                  <template v-for="(item, index) in noLeido">
                    <v-list-item class="px-0">
                      <v-list-item-avatar>
                        <v-avatar
                          color="indigo"
                          size="40"
                        >
                          <span
                            class="white--text font-weight-bold text-4"
                            v-text="item.siglas || ''"
                          />
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          <span v-text="item.nombre" />
                        </v-list-item-title>
                        <v-list-item-subtitle v-text="item.jefe.nombres_apellidos" />
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider
                      v-if="index < items.length - 1"
                      :key="index"
                    ></v-divider>
                  </template>
                </v-list>
              </v-tab-item>
            </v-tabs-items>

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
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
          ? this.items.filter(dpto => dpto?.pivot?.leido === 1 && dpto?.pivot?.copia === 0)
          : []
      },
      noLeido () {
        return this.items.length > 0
          ? this.items.filter(dpto => dpto?.pivot?.leido === 0 && dpto?.pivot?.copia === 0)
          : []
      },
      copiasItems () {
        return this.items.length > 0
          ? this.items.filter(dpto => dpto?.pivot?.copia === 1)
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
  }
</script>
