<template>
  <v-container
    id="password"
    fluid
    tag="section"
    class="pa-1 d-flex"
  >
    <v-row class="mt-8">
      <v-col
        cols="12"
        sm="8"
        md="9"
        lg="9"
        class="mx-auto"
      >
        <v-card>
          <v-card-title class="primary--text text-h3 font-weight-bold">
            Cambiar Contraseña
          </v-card-title>
         <v-card-subtitle class="col col-9">
            Ingrese los datos necesario para cambiar la contraseña
          </v-card-subtitle>
          <v-card-text class="px-6">
            <validation-observer ref="USER_PASSWD" tag="div">
              <v-row>
                <v-col cols="12" class="mb-0">
                  <label-form text="Contraseña Actual" required/>
                  <validation-provider name="Contraseña" vid="datos.password" rules="required" v-slot="{ errors }">
                    <v-text-field 
                      v-model="datos.password"
                      dense
                      outlined
                      :disabled="updated"
                      :type="actual ? 'text' : 'password'"
                      :append-icon="actual ? 'mdi-eye' : 'mdi-eye-off'"
                      :error-messages="errors[0]"
                      @click:append="actual = !actual"    
                    />
                  </validation-provider>                         
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="mb-0">
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
                  <div class="px-3 pb-4 pt-1">
                    <v-progress-linear
                      v-model="check.porcent"
                      :color="check.color"
                      rounded
                      height="8"
                    />
                    <span class="blue-grey--text text--darken-3 caption">Nivel de Seguridad: </span>
                    <span
                      class="blue-grey--text text--darken-3 caption font-weight-bold"
                      v-text="check.level"
                    />
                  </div>     
                </v-col>
                <v-col cols="6" class="mb-0">
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
                  tile
                  depressed
                  :disabled="updated"
                  color="blue-grey lighten-5"
                  class="px-6 mx-3"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  tile
                  color="secondary"
                  class="px-8"
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
        </v-card>
      </v-col>
    </v-row>  
  </v-container>
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
          password: '',
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
             this.$root.$showAlert(
              error.response.data.message,
              'error',
            )
          }
          this.updated = false
        }
      },
    },
    computed: {
      check () {
        const {value, porcent} = passwordStrength(this.datos.newpassword)
        const optionsColor = {
          25: 'blue-grey',
          50: 'deep-orange',
          75: 'blue accent-3',
          100: 'green accent-3',
        }

        return {
          level: value,
          porcent: porcent,
          color: optionsColor[porcent] || 'blue-grey lighten-2',
        }
      },
    }
  }
</script>