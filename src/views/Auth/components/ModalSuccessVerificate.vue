<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="490"
    >
      <v-card>
        <v-card-title class="d-flex flex-column justify-center align-center">
          <v-avatar size="125" class="avatar-outlined pa-12 my-8">
            <v-icon color="secondary" size="80">mdi-email-check</v-icon>
          </v-avatar>
          <h2 class="primary--text font-weight-bold">
            Código de Verificación Enviado
          </h2>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <p class="text-center">
            Verifique la bandeja de entrada de su correo, al recibir el código presione continuar, de lo contrario presione reenviar.
          </p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center pt-0 pb-5">
            <v-btn
              color="secondary"
              class="pr-4"
              dark
              despress
              @click="resend"
            >
            <v-icon left>mdi-email-outline</v-icon>
              Reenviar
            </v-btn>
            <v-btn
              color="icono"
              despress
              dark
              class="pl-4"
              @click="confirm"
            >
              Continuar
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name: 'ModalSuccess',
    props: {
      value: Boolean,
      userData: {
        type: String,
        value: '',
      },
    },
    data() {
      return {
        dialog: this.value,
      }
    },
    watch: {
      dialog (val, oldVal) {
        if (val === oldVal) return

        this.$emit('input', val)
      },
      value (val, oldVal) {
        if (val === oldVal) return

        this.dialog = val
      },
    },
    methods:{
      resend () {
        this.dialog = false
        this.$emit('resend')
      },
      confirm () {
        this.dialog = false
        this.$router.push({ name: 'Verificacion', query: { r: this.userData } })
      }
    }
  }
</script>
<style>
.avatar-outlined {
  border-color: #607d8b !important;
  border-style: solid;
  border-width: 1px;
}
</style>
