<template>
  <div class="mb-1">
    <span class="display blue-grey--text text--darken-3" v-text="text" /> 
    <span v-if="required" class="secondary--text font-weight-bold">*</span>                            
  </div>
</template>
<script>
export default {
  name:'LabelForm',
  props:{
    text: String,
    required:{
      type: Boolean,
      default: false
    }
  }
}
</script>