import { dynamicRoutes } from '@/router'
import { dispatch } from 'vuex-pathify'


/**
 * Usa meta.p para determinar si el modulo tiene permiso 
 * @param permisos
 * @param route
 */
function hasPermission(permisos, route) {
  if (route.meta && route.meta.p) {
    return route.children 
      ? permisos.some(permiso => permiso.split('.').includes(route.meta.p))
      : permisos.some(permiso => route.meta.p === permiso)
  } else {
    return true
  }
}

/**
 * Filtrar todas las rutas por recursividad
 * @param routes asyncRoutes
 * @param permisos
 */
export function filterAsyncRoutes(routes, permisos) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permisos, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permisos)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
  }
}

const actions = {
  generateRoutes({ commit, rootGetters }, permisos) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(dynamicRoutes, permisos)
      // commit('SET_ROUTES', accessedRoutes)
      const menuGenerated = filterAsyncRoutes(rootGetters['app/items'], permisos)
      dispatch('app/setMenuApp', menuGenerated)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}