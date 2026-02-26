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
                    Recuperar Contraseña
                  </div>
                </div>
              </v-theme-provider>
            </v-sheet>
          </v-card-title>
          <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
            <validation-observer ref="RESET_FORM">
              <v-row class="pb-3 pt-1">
                <v-col cols="12" class="mb-0 pb-0 text-center">
                  <span>Se enviara un correo con un código de verificación para continuar con la solicitud, por favor ingrese los datos de su usuario registrado.</span>
                </v-col>
                <v-col cols="12" class="mb-0 pb-0">
                  <validation-provider name="Correo Electrónico" vid="email" rules="required|email" v-slot="{ errors }">
                    <v-text-field
                      v-model="credentials.email"

                      label="Correo Eléctronico"
                      clearable
                      :error-messages="errors[0]"
                      :disabled="loading"
                      color="label"
                    >
                      <template slot="prepend-inner">
                        <v-icon left color="label">mdi-email</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="mb-0 pb-0">
                  <validation-provider name="Cédula de Identidad" vid="identification" rules="required|numeric|max:8" v-slot="{ errors }">
                    <v-text-field
                      v-model="credentials.identification"

                      label="Cédula de Identidad"
                      clearable
                      :error-messages="errors[0]"
                      :disabled="loading"
                      color="label"
                    >
                      <template slot="prepend-inner">
                        <v-icon left color="label">mdi-badge-account-horizontal</v-icon>
                      </template>
                    </v-text-field>
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
                    @click="verificateUser"
                    :loading="loading"
                  >
                    Enviar
                    <v-icon right>
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" class="d-flex justify-space-between align-center pt-0">
                  <v-btn
                    link
                    text
                    small
                    :ripple="false"
                    color="secondary"
                    :to="{path: '/auth/login'}"
                  >
                    <v-icon left>
                      mdi-arrow-left
                    </v-icon>
                    regresar
                  </v-btn>
                  <v-btn
                    link
                    text
                    small
                    :ripple="false"
                    color="secondary"
                    class=""
                  >
                    Ya tengo el código
                  </v-btn>
                </v-col>
              </v-row>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <modal-success-verificate v-model="modalSuccess" :user-data="response" />
    <material-snackbar
      v-model="error.active"
      type="error"
    >
      {{ error.message }}
    </material-snackbar>
  </div>
</template>
<script>
import { recoverPassword } from '@/services/auth'
export default {
  name: 'Login',
  components: {
    ModalSuccessVerificate: () => import(
      /* webpackChunkName: "modal-success-verificate" */
      './components/ModalSuccessVerificate.vue'
    )
  },
  data () {
    return {
      credentials: {
        email: 'eclopezluna@gmail.com',
        identification: '16037750',
      },
      modalSuccess: false,
      loading: false,
      response: '',
      error:{
        active: false,
        message: '',
      },
    }
  },
  methods:{
    async verificateUser () {
      const valid = await this.$refs.RESET_FORM.validate();
      if(valid) {
        this.loading = true;
        try {
          const { data } = await recoverPassword({ datos: this.credentials })
          this.response = data?.ur
          console.log(data)
          this.modalSuccess = true
        } catch ({response = null}) {
          if(response?.status === 422) {
            this.$refs.RESET_FORM.setErrors(response?.data?.errors)
            return 
          }
          
          this.error = {
            active: true,
            message: response ? response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.',
          }          
        } finally {
          this.loading = false
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
