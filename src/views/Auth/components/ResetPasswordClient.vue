<template>
  <v-card-text class="px-6">
    <validation-observer ref="USER_PASSWD" tag="div">
      <v-row>
        <v-col cols="12" class="mb-0">
          <label-form text="Contraseña Nueva" required />
          <validation-provider name="Nueva Contraseña" vid="datos.newpassword" rules="required|min:8" v-slot="{ errors }">
            <v-text-field
            v-model="datos.newpassword"
              dense
              outlined
              persistent-hint
              hint="Mínimo 8 caracteres"
              :disabled="updated"
              :type="nueva ? 'text' : 'password'"
              :append-icon="nueva ? 'mdi-eye' : 'mdi-eye-off'"
              :error-messages="errors[0]"
              @click:append="nueva = !nueva"
            />
          </validation-provider>
        </v-col>
        <v-col cols="12" class="mb-0">
          <label-form text="Repetir Contraseña" required />
          <validation-provider name="Repetir Contraseña" vid="datos.repassword" rules="required|confirmed:datos.newpassword|min:8" v-slot="{ errors }">
            <v-text-field
              v-model="datos.repassword"
              dense
              outlined
              :disabled="updated"
              :type="confirmar ? 'text' : 'password'"
              :append-icon="confirmar ? 'mdi-eye' : 'mdi-eye-off'"
              :error-messages="errors[0]"
              @click:append="confirmar = !confirmar"
            />
          </validation-provider>
        </v-col>
      </v-row>
    </validation-observer>
    <v-row>
      <v-col cols="12" class="text-right mx-auto">
        <v-btn
          color="secondary"
          depressed
          class="px-12"
          block
          :loading="updated"
          @click="changePassword"
        >
          Cambiar
          <v-icon right>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>
<script>
import { passwordStrength } from '@/util/PasswordCheck'

  export default {
    name:'ChangePassword',
    data: () => ({
      actual: false,
      nueva: false,
      confirmar: false,
      datos: {
        password: '',
        newpassword: '',
        repassword: '',
      },
      updated: false,
    }),
    methods: {
      resetData() {
        this.datos = {
          newpassword: '',
          repassword: '',
        }
        this.actual = this.nueva = this.confirmar = false
        this.$refs.USER_PASSWD.reset()
      },
      async changePassword() {
        const validForm = await this.$refs.USER_PASSWD.validate();
        if(validForm) {
          this.updated = true
          try {
            const { data } = await this.$api.post('auth/changepassword', this.datos)
            this.$root.$showAlert(data.message, 'success');
            this.resetData()
          } catch (error) {
            if(error.response){
              this.$root.$showAlert(
                error.response.data.errors.message,
                'error',
              )

            }
          }
          this.updated = false
        }
      },
    },
  }
</script>
