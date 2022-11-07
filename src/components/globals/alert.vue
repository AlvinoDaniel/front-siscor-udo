<template>
   <material-snackbar
      :type="type"
      :icon="icon"
      v-model="active"
    >
      <span v-html="message" />
    </material-snackbar>
</template>
<script>
export default {
  name: 'AlertGlobal',
  data () {
    return {
      active: false,
      type: '',
      message: '',
      icon: null,
    }
  },
  methods:{
    show (message, type, icon = null) {
      this.active = true;
      this.message = message;
      this.type = type;
      this.icon = icon;
    },
    hide () {
      this.active = false;
      this.message = '';
      this.type = '';
      this.icon = null;
    }
  }
}
</script>
