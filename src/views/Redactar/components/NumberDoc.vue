<template>
  <v-dialog
    v-model="show"
    width="600"
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5 primary--text grey lighten-5 font-weight-bold">
        Número de Oficio
      </v-card-title>
      <v-card-text class="">
        <validation-observer ref="NUMBER_DOC_FORM">
          <v-row class="ma-0">
            <v-col cols="12" class="px-0">
              <validation-provider name="Número" vid="nro_doc" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="nro_doc"
                  class="input-redactar"
                  :error-messages="errors[0]"
                  label=""
                  placeholder="Ingrese el Número"
                  prepend-inner-icon="mdi-playlist-edit"
                >
                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
        </validation-observer>
      </v-card-text>
      <v-card-actions class="d-flex justify-center mb-3">
        <v-btn
          tile
          depressed
          color="blue-grey lighten-5"
          class="px-8 mx-2"
          :small="$vuetify.breakpoint.mobile"
          @click="cerrar"
        >
          Cancelar
        </v-btn>
        <v-btn
          tile
          depressed
          color="primary"
          class="px-8"
          :small="$vuetify.breakpoint.mobile"
          @click="save"
        >
          {{action === 'edit' ? 'Actualizar' : 'Aceptar'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    name: 'NumberDoc',
    props: {
      value: Boolean,
      action: {
        type: String,
        default: 'crear',
      },
      docNumber: String
    },
    data () {
      return {
        show: this.value,
        nro_doc: this.docNumber
      }
    },
    watch: {
      show (val, oldVal) {
        if (val === oldVal) return

        this.$emit('input', val)
      },
      value (val, oldVal) {
        if (val === oldVal) return

        this.show = val
      },
    },
    methods: {
      async save(){
        const valid = await this.$refs.NUMBER_DOC_FORM.validate()
        if(valid){
          this.$emit('register', this.nro_doc)
          this.show = false
        }
      },
      cerrar(){
        this.$emit('register', this.action === 'edit' ? this.nro_doc : null)
        this.show = false
      }
    }
  }
</script>
