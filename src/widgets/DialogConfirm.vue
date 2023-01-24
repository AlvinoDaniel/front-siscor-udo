<template>
   <v-bottom-sheet
      v-model="show"
      hide-overlay
      @keydown.esc="cancel"
   >
      <v-card class="grey lighten-4">
         <v-card-text v-show="!!message" class="px-6 pt-0 pb-5">
            <v-row justify="center" align-content="center">
               <v-col cols="6" class="pt-0 d-flex justify-center">
                  <v-list two-line class="grey lighten-4">
                     <v-list-item>
                        <v-list-item-avatar color="primary lighten-2" size="60">
                            <v-icon dark size="35px" v-if="options.type == 'delete'">mdi-trash-can-outline</v-icon>
                            <v-icon size="40px" color="deep-orange" v-if="options.type == 'confirm'">mdi-help-circle-outline</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title style="white-space:normal !important">
                            <span class="blue-grey--text font-weight-bold" style="font-size:18px">{{ title }}</span>
                          </v-list-item-title>
                          <v-list-item-subtitle class="mt-2" style="white-space:normal !important">
                            <span class="body-2">{{ message }}</span>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                     </v-list-item>
                  </v-list>
               </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6" class="px-0 pt-1 text-center">
                <v-btn dark @click.native="cancel" color="blue-grey lighten--4" class="px-6" small depressed>
                  <v-icon left>mdi-close-octagon-outline</v-icon>
                  {{ options.btnCancelText }}
                </v-btn>
                 <v-btn
                  @click.native="agree"
                  :color="colorBtn"
                  small
                  depressed
                  class="px-12 mx-4"
                >
                  <span v-text="options.btnConfirmText" />
                  <v-icon right>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <!-- <v-row justify="center">
              <v-col cols="4" class="px-0 pt-0 text-center">
              </v-col>
            </v-row> -->
         </v-card-text>
      </v-card>
  </v-bottom-sheet>
</template>

<script>
export default {
  name:'Confirm',
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      type: 'delete',
      btnConfirmText: 'Si, eliminar',
      btnCancelText: 'Descartar',
    }
  }),
  computed: {
    show: {
      get() {
        return this.dialog
      },
      set(value) {
        this.dialog = value
        if (value === false) {
          this.cancel()
        }
      }
    },
    colorBtn(){
      return this.options.type == "delete" ? 'error' : this.options.type == "confirm" ? 'info' : 'warning';
    }
  },
  methods: {
    open(title, message, options) {
      this.dialog = true
      this.title = title
      this.message = message
      if(options)
        this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
<style scope>

   .v-title__icon_large .v-icon{
      align-self: center;
       height: 78px;
       min-width: 78px;
   }

.v-title__icon_large .v-icon:after {
    background: currentColor !important;
    border-radius: 50%;
    bottom: 0;
    content: "";
    left: 0;
    opacity: 0.16;
    position: absolute;
    right: 0;
    top: 0;
}

</style>
