<template>
  <v-menu
    bottom
    left
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        icon
        v-bind="attrs"
        v-on="on"
        :small="$vuetify.breakpoint.mobile"
        :dark="$vuetify.breakpoint.mobile"
      >
        <v-badge
          bordered
          color="red"
          dot
        >
          <!-- <template v-slot:badge>
            <span>5</span>
          </template> -->

          <v-icon>mdi-bell-ring</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-list
      flat
      nav
    >
      <app-bar-item
        v-for="(n, i) in notifications"
        :key="i"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ n }} </v-list-item-title>
        </v-list-item-content>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultNotifications',

    data: () => ({
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
    }),
  }
</script>
