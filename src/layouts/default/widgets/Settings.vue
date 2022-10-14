<template>
  <v-menu
    v-if="itemsSettings.length > 0"
    bottom
    right
    min-width="350"
    offset-y
    transition="scale-transition"
    rounded="lg"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        min-width="0"
        plain
        :dark="$vuetify.breakpoint.mobile"
        :small="$vuetify.breakpoint.mobile"
        :ripple="false"
        large
        class="mr-1 text-capitalize"
        :color="$vuetify.breakpoint.mdAndUp ? 'primary' : 'white'"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon size="23" class="mr-2">mdi-cog</v-icon>
        <span v-if="$vuetify.breakpoint.smAndUp">Configuración</span>
      </v-btn>
    </template>
    <v-list
      class="py-0"
    >
      <v-list-item-group
        color="primary"
      >
      <template v-for="(item, i) in itemsSettings">
        <v-hover v-slot="{ hover }" :key="'itemSetting-'+i">
          <v-list-item class="py-1 px-8" :to="{path: item.to}">
            <v-list-item-icon class=" mr-3 align-self-center">
              <v-avatar
                color="blue-grey lighten-5"
                rounded
                size="45"
              >
                <v-icon :color="item.color" size="26" v-text="item.icon" />
              </v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold primary--text" v-text="item.name" />
              <v-list-item-subtitle v-text="item.subtitle" />
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-show="hover" size="20" :color="item.color">mdi-arrow-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-hover>
      </template>
        
        <!-- <v-hover v-slot="{ hover }">
          <v-list-item class="py-1 px-8" :to="{path: '/configuracion/roles'}">
            <v-list-item-icon class=" mr-3 align-self-center">
              <v-avatar
                color="blue-grey lighten-5"
                rounded
                size="45"
              >
                <v-icon color="purple" size="26">mdi-account-cog</v-icon>
              </v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold primary--text">Roles</v-list-item-title>
              <v-list-item-subtitle>Administre los Roles de usuarios del Sistema</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-show="hover" size="20" color="purple">mdi-arrow-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-hover>
        
        <v-hover v-slot="{ hover }">
          <v-list-item class="py-1 px-8" :to="{path: '/configuracion/permisos'}">
            <v-list-item-icon class=" mr-3 align-self-center">
              <v-avatar
                color="blue-grey lighten-5"
                rounded
                size="45"
              >
                <v-icon color="orange" size="26">mdi-order-bool-ascending-variant</v-icon>
              </v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold primary--text">Permisos</v-list-item-title>
              <v-list-item-subtitle>Administre los permisos de usuarios</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-show="hover" size="20" color="orange">mdi-arrow-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-hover>        -->
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultSetting',
    data: () => ({
      settings: [
        {
          name: 'Usuarios',
          subtitle: 'Administre los usuarios del Sistema',
          icon: 'mdi-account-group',
          to: '/configuracion/usuarios',
          permission: 'configuracion.usuarios.consulta',
          color: 'icono',
        },
        {
          name: 'Roles',
          subtitle: 'Administre los Roles de usuarios del Sistema',
          icon: 'mdi-account-cog',
          to: '/configuracion/roles',
          permission: 'configuracion.roles.consulta',
          color: 'purple',
        },
        {
          name: 'Permisos',
          subtitle: 'Administre los permisos de usuarios',
          icon: 'mdi-order-bool-ascending-variant',
          to: '/configuracion/permisos',
          permission: 'configuracion.permisos.consulta',
          color: 'orange',
        },
        {
          name: 'Parámetros del Sistema',
          subtitle: 'Gestione los parámetros configurables del Sistema',
          icon: 'mdi-folder-cog',
          to: '/configuracion/parametros-sistema',
          permission: 'configuracion.permisos.consulta',
          color: 'info',
        },
      ]
    }),
    computed: {
      itemsSettings() {
        return this.settings.filter(item => this.$hasPermission(item.permission))
      }
    },
  }
</script>
