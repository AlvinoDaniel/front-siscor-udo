<template>
  
</template>
<script>
  export default {
    name: 'DefaultBreadcrumbs',

    data: () => ({
      bread: [
        { title: 'Inicio', },
        { divider: true },
        { title: 'Cerrar Sesión', icon:'mdi-exit-to-app' },
      ],
    }),
  }
</script>