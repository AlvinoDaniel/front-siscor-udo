<template>
  <v-text-field
    v-model="search"
    @focus="focusInput"
    @blur="blurInput"
    dense
    hide-details
    :disabled="load"
    filled
    clearable
    v-bind="$attrs"
    class="theme-custom rounded-lg expand-search"
    :class="{'closed' : expand && searchClose && !search}"
  >
    <template v-slot:prepend-inner>
      <v-icon  @click="searchClose = false" color="secondary" size="22" v-if="expand">mdi-magnify</v-icon>
      <v-icon color="secondary" size="22" v-else>mdi-magnify</v-icon>
    </template>
  </v-text-field>
</template>
<script>
export default {
  name: 'SearchExpand',
  props:{
    value: String,
    load: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return{
      search: this.value,
      searchClose: true
    }
  },

  watch: {
    search (val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value (val, oldVal) {
      if (val === oldVal) return

      this.search = val
    },
  },

  methods: {
    focusInput(){
      if(this.expand)
        this.searchClose = false;
      else
        return;
    },
    blurInput(){
      if(this.expand)
        this.searchClose = true;
      else
        return;
    }
  }
}
</script>