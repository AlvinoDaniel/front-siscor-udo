<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    no-data-text="No hay registros que coincidan"
    placeholder=""
    :multiple="multiple"
    chips
    item-text="nombre_legal"
    item-value="id"
    :class="$attrs.class"
    :disabled="$attrs.disabled"
    append-icon=""
    :error-messages="error"
    @change="emitChange"
  >
    <template v-slot:prepend-inner>
      <span class="px-2" v-text="labelText" />
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
          <span class="white--text text-uppercase caption" v-text="data.item.nombre_legal.at(0)" />
        </v-avatar>
        {{ data.item.nombre_legal }} <strong class="ml-1">(EXTERNO)</strong>
      </v-chip>
    </template>
    <template v-slot:item="data">
      <v-list-item-avatar color="secondary" class="justify-center">
        <span class="white--text font-weight-bold text-h6" v-text="data.item.nombre_legal.at(0)" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="data.item.nombre_legal" />
        <v-list-item-subtitle
          v-html="data.item.documento_identidad"
        />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: 'SelectExternos',
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
