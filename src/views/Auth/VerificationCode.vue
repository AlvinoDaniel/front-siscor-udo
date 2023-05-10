<template>
  <div>
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
                    {{ subtitleCard }}
                  </div>
                </div>
              </v-theme-provider>
            </v-sheet>
          </v-card-title>
          <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <validation-observer ref="RESET_FORM">
                  <v-row class="pb-3 pt-1">
                    <v-col cols="12" class="mb-0 pb-0 text-center">
                      <span>Por favor ingrese el código de verificiación que se envio a su correo.</span>
                    </v-col>
                    <v-col cols="12" class="mb-0 pb-0">
                      <validation-provider name="Código" vid="code" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="code"
                          placeholder="Ingrese el código"
                          clearable
                          :error-messages="errors[0]"
                          :disabled="loading"
                          color="label"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="text-center mx-auto mt-5">
                    <v-btn
                        color="secondary"
                        depressed
                        class="px-12"
                        block
                        @click="tab=1"
                        :loading="loading"
                      >
                        Confirmar
                        <v-icon right>
                          mdi-check
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center align-center pt-0">
                      <v-btn
                        link
                        text
                        small
                        :ripple="false"
                        color="secondary"
                        class=""
                      >
                        Reenviar Correo
                      </v-btn>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-tab-item>
              <v-tab-item>
                <reset-password-client />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <material-snackbar
      v-model="error.active"
      type="error"
    >
      {{ error.message }}
    </material-snackbar>
  </div>
</template>
<script>
export default {
  name: 'Login',
  components: {
    ResetPasswordClient: () => import(
      /* webpackChunkName: "reset-password-client" */
      './components/ResetPasswordClient.vue'
    )
  },
  data () {
    return {
     code: '',
      loading: false,
      error:{
        active: false,
        message: '',
      },
      tab: 0,
    }
  },
  computed: {
    subtitleCard() {
      const TEXT_ACTION = {
        0: 'Código de Verificacíon',
        1: 'Cambiar Contraseña',
      }

      return TEXT_ACTION[this.tab] ?? ''
    },
  },
  methods:{
    async verificateUser () {
      const valid = await this.$refs.RESET_FORM.validate();
      if(valid) {
        this.loading = true;
        try {
          this.modalSuccess = true
        } catch (error) {
          this.error = {
            active: true,
            message: e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.'
          };          
        } finally {
          this.loading = false;
        }
      }
		},
  },

}
</script>
<style lang="sass">
  .v-card.v-card--material
    > .v-card__title
      > .v-card--material__title
        flex: 1 1 auto
        word-break: break-word
  .full-height
    height: 100vh
</style>
