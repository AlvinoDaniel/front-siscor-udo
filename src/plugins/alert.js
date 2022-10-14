import AlertGlobal from '../components/globals/alert'

export default{
  install(Vue){
    const pluginAlert = Vue.extend(AlertGlobal);
    const vm = new pluginAlert({
      data:{
        active: false,
        type: '',
        message: '',
      }
    }).$mount();

    document.getElementById("app").appendChild(vm.$el);

    Vue.prototype.$ShowAlert = function (message, type) {
      vm.show(message, type);
    }

    Vue.prototype.$HideAlert = function () {
      vm.hide();
    }

  }
}
