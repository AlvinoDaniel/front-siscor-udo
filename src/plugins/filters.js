import Vue from 'vue'
import moment from 'moment'
// import es from 'moment/locale/es'

Vue.filter('FormatCurrency', (value) => {
	var numberFormat = new Intl.NumberFormat('es-ES');
    return numberFormat.format(value);
});

Vue.filter('smartDate', (date) => {
  moment.locale('es');

  return date ? moment(date).format('D MMM YYYY') : '';
})

Vue.filter('shortDate', (date) => {
  moment.locale('es');

  return date ? moment(date).format('DD MMM') : '';
})

Vue.filter('largeDate', (date) => {
  moment.locale('es');

  return date ? moment(date).format('DD MMMM, YYYY') : '';
})

Vue.filter('FullDate', (date) => {
  moment.locale('es');
  return date ? moment(date).format('DD MMM YYYY, hh:mm A') : '';
})

Vue.filter('DocDate', (date) => {
  moment.locale('es');
  return date ? moment(date).format('DD [de] MMMM [de] YYYY') : '';
})
