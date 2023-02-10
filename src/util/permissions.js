import store from '../store'

/**
 * @param {String} permiso
 * @returns {Boolean}
 */

const hasPermission = rolName => {
  const { rol } = store.getters['user/info']
  return rol.includes(rolName)
}

let __servicePermissions = false;

export default function install(Vue) {

  if (__servicePermissions) return;

  Vue.prototype.$hasPermission = hasPermission;

  __servicePermissions = true;
}
