import store from '../store'

/**
 * @param {String} permiso
 * @returns {Boolean}
 */

const hasPermission = rolName => {
  const { rol } = store.getters['user/info']
  return rolName === rol
}

let __servicePermissions = false;

export default function install(Vue) {

  if (__servicePermissions) return;

  Vue.prototype.$hasPermission = hasPermission;

  __servicePermissions = true;
}
