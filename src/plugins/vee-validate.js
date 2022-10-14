import Vue from 'vue'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  localize
} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import es from 'vee-validate/dist/locale/es.json'

Object.keys(rules).forEach(rule => {
	extend(rule, rules[rule]);
});

extend('url', {
    validate: (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    },
    message: 'Verifique el formato, el campo clave debe ser una URL válida'
 })

localize('es', es);

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
