<template>
  <router-view :key="key" />
</template>
<script>
export default {
  name: 'LayoutChildren',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>