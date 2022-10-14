<template>
  <div>
    <v-app-bar
      app
      absolute
      color="white"
      elevation="1"
    >
      <v-toolbar-title>
        <v-img
          :src="
            require('@/assets/Logos/IDENTIDAD_1.png')"
          width="250"
        />
      </v-toolbar-title>

      <v-spacer></v-spacer>

     <v-toolbar-title>
        <v-img
          :src="
            require('@/assets/Logos/Logo_UDO.png')"
          width="50"
        />
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="d-flex justify-center align-center mt-8">
      <v-container
        fluid
        :class="{'pa-0':$vuetify.breakpoint.xsOnly}"
      >
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-card
              style="z-index:10"
              :flat="$vuetify.breakpoint.xsOnly"
              :color="$vuetify.breakpoint.xsOnly ? 'transparent' : ''"
              class="v-card--material"
            >
              <v-card-title class="align-start mb-4">
                <v-sheet
                  color="secondary"
                  width="100%"
                  class="overflow-hidden mt-n9 transition-swing v-card--material__sheet"
                  elevation="6"
                  max-width="100%"
                  rounded
                >
                  <v-theme-provider dark>
                    <div
                      class="text-h4 text-center white--text pa-7 v-card--material__title"
                    >
                      SISTEMA DE CORRESPONDENCIA
                      <div class="text-subtitle-1 text-center mb-n4 font-weight-bold">
                        Autenticación Web
                      </div>
                    </div>
                  </v-theme-provider>
                </v-sheet>
              </v-card-title>
              <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly}">
                <validation-observer ref="LOGIN_FORM">
                  <v-row>
                    <v-col cols="12" class="mb-0 pb-0">
                      <validation-provider name="Usuario/Correo Electrónico" vid="username_email" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="credentials.username_email"
                          outlined
                          label="Usuario/Correo Electrónico"
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin"
                          color="label"
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-account</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 py-0">
                      <validation-provider name="Contraseña" vid="password" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="credentials.password"
                          outlined
                          color="label"
                          :type="ShowPassword ? 'text' : 'password'"
                          label="Contraseña"
                          prepend-inner-icon="mdi-lock"
                          :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="ShowPassword = !ShowPassword"
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin"
                          @keyup.enter="login"
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-lock</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="10" class="text-center mx-auto">
                    <v-btn
                        color="secondary"
                        depressed
                        class="px-12"
                        block
                        @click="login"
                        :loading="LoadingLogin"
                      >
                        Acceder
                        <v-icon right>
                          mdi-arrow-right
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center align-center pt-0">
                      <span class="text-subtitle-1 label--text mx-2">¿Olvidaste tu Contraseña?</span>
                      <v-btn
                        link
                        text
                        small
                        :ripple="false"
                        color="secondary"
                        class="text-capitalize"
                      >
                        recuperar Aquí
                      </v-btn>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <material-snackbar
        v-model="error.active"
        type="error"
      >
        {{ error.message }}
      </material-snackbar>
    </v-main>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        username_email: '',
        password: '',
      },
      ShowPassword: false,
      LoadingLogin: false,
      error:{
        active: false,
        message: '',
      },
    }
  },
  methods:{
    async login () {
      const valid = await this.$refs.LOGIN_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        this.$store.dispatch('user/login',this.credentials).then(response => {
          this.$router.push({ path: '/'});
          this.LoadingLogin = false;
        }).catch(e => {
          this.error = {
            active: true,
            message: e.response ? e.response.data.message[0] : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.'
          };
          this.LoadingLogin = false;
        });
      }
		},
  }

}
</script>
<style lang="sass">
  .v-card.v-card--material
    > .v-card__title
      > .v-card--material__title
        flex: 1 1 auto
        word-break: break-word
</style>
