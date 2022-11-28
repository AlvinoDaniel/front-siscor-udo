<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    no-data-text="No hay registros que coincidan"
    placeholder=""
    :multiple="multiple"
    chips
    item-text="nombre"
    item-value="id"
    :class="$attrs.class"
    append-icon=""
    :error-messages="error"
    @change="emitChange"
  >
    <template v-slot:prepend-inner>
      <span class="px-2" v-text="labelText" />
    </template>
    <template v-if="btnCopia" v-slot:append-outer>
       <v-btn-toggle
        v-model="copia"
        color="secondary"
        dense
        group
        :value="false"
        @change="showCopia"
      >
        <v-btn class="btn-cc" :value="true" text>
          <v-icon left>mdi-text-box-plus-outline</v-icon>
          Copias
        </v-btn>
      </v-btn-toggle>
    </template>
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        text-color="blue-grey darken-4"
        @click="data.select"
        @click:close="remove(data.item)"
      >
        <v-avatar left color="secondary">
          <span class="white--text caption" v-text="data.item.siglas" />
        </v-avatar>
        {{ data.item.nombre }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <v-list-item-avatar color="secondary" class="justify-center">
        <span class="white--text font-weight-bold" v-text="data.item.siglas" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="data.item.nombre" />
        <v-list-item-subtitle v-html="data.item.jefe.nombres_apellidos" />
      </v-list-item-content>
    </template>
    <!-- <template v-slot:prepend-item>
      <v-list-item @click="allSeleted">
        <v-list-item-avatar color="tertiary" class="justify-center">
          <span class="white--text font-weight-bold" v-text="'C'" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="'Comunidad Universitaria'" />
          <v-list-item-subtitle v-text="'Todos los Departamentos'" />
        </v-list-item-content>
      </v-list-item>
    </template> -->
  </v-autocomplete>
</template>
<script>
export default {
  name: 'SelectDepartamento',
  props: {

    value: {
      type: [Array, Number, String],
      default: () => ([]),
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    btnCopia: {
      type: Boolean,
      default: true,
    },
    error: String,
    labelText: String,

  },
  data () {
    return {
      selected: this.value,
      copia: false,
    }
  },
  watch: {
    value (val, oldVal) {
      this.selected = val
    },
    selected (val, oldVal) {
      this.$emit('input', val)
    },
    multiple (val) {
      if (val) {
        this.copia = false
        this.$emit('showCopia', false)
      }
    },
  },
  methods: {
     remove (item) {
      if (this.multiple) {
        const index = this.selected.indexOf(item.id)
        if (index >= 0) this.selected.splice(index, 1)
      } else {
        this.selected = []
      }
    },
    showCopia (e) {
      this.$emit('showCopia', Boolean(this.copia))
    },
    emitChange (e) {
      if(typeof e === 'object' && e.includes('all')) {
        this.selected = e.filter(item => item === 'all')
      }
      if (!this.multiple) this.$emit('change', e)
    },
  }
}
</script>
<style>
.btn-cc {
  height: 31px !important;
  border-radius: 5px;
}


</style>
