<template>
   <material-snackbar 
      :type="type" 
      v-model="active" 
    >
      <span v-html="message" />
    </material-snackbar>
</template>
<script>
export default {
  name:'AlertGlobal',
  data(){
    return {
      active: false,
      type: '',
      message: ''
    }
  },
  methods:{
    show(message, type){
      this.active = true;
      this.message = message;
      this.type = type;
    },
    hide(){
      this.active = false;
      this.message = '';
      this.type = '';
    }
  }
}
</script>