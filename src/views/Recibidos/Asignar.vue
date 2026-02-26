<template>
  <v-dialog
    v-model="show"
    width="600"
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5 primary--text grey lighten-5 font-weight-bold">
        <v-icon left size="20" color="primary">mdi-file-replace-outline</v-icon>
        Asignar Documento
      </v-card-title>
      <v-card-text class="">
        <v-row>
          <v-col cols="12">
            <v-list class="pt-0">
              <v-list-item class="px-0 pb-0">
                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-space-between">
                    <span v-if="doc.propietario" class="font-weight-bold text-h5" v-text="doc.propietario.nombre" />
                    <span class="text-subtitle-1 blue-grey--text" v-if="doc.fecha_enviado">{{ doc.fecha_enviado | smartDate }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle v-text="doc.asunto" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <validation-observer ref="ASIGNAR_FORM">
          <v-row class="ma-0">
            <v-col cols="12" class="px-0 pt-0">
              <validation-provider name="Departamento" vid="dpto_select" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="dpto_select"
                  item-text="nombre"
                  item-value="id"
                  :items="subDepartamentos"
                  :loading="load"
                  label="Seleccione el Departamento"
                  :error-messages="errors[0]"
                ></v-autocomplete>
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
          :disabled="assigning"
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
          :loading="assigning"
          @click="save"
        >
          Asignar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { get } from 'vuex-pathify'
import { assignDocument } from '@/services/documento'
  export default {
    name: 'Asignar',
    props: {
      value: Boolean,
      doc: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        show: this.value,
        dpto_select: null,
        load: false,
        assigning: false,
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
    computed: {
      subDepartamentos: get('user/subDepartamentos'),
    },
    methods: {
      async save(){
        const valid = await this.$refs.ASIGNAR_FORM.validate()
        if(valid){
          this.assigning = true
          try {
            const { message } = await assignDocument({ 
              datos: {
                departamento: this.dpto_select, 
                documento: this.doc.id
              } 
            })

            this.$root.$showAlert(message, 'success')
            this.show = false;
            this.$emit('processed')
          } catch (error) {
            console.log(error)
            this.$root.$showAlert('Lo sentimos, hubo un error al intentar asignar el documento', 'error')
          } finally {
            this.assigning = false
          }
        }
      },
      cerrar(){
        this.$emit('register', this.action === 'edit' ? this.nro_doc : null)
        this.show = false
      }
    }
  }
</script>
