import store from '../store'

/**
 * @param {String} permiso
 * @returns {Boolean}
 */

const hasPermission = permiso => {
	if (permiso && permiso !== '') {
		const { permisos } = store.getters['user/info']
		return permisos.some(item => permiso === item)

	} else {
	return false
	}
}

let __servicePermissions = false;

export default function install(Vue) {

  if (__servicePermissions) return;

  Vue.prototype.$hasPermission = hasPermission;

  __servicePermissions = true;
}
