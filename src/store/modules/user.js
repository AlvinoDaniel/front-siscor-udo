// Utilities
import { make } from 'vuex-pathify'
import api from '../../util/request'
import * as cookies from '../../util/auth_user'
import { resetRouter } from '@/router'

const state = {
  info:{},
  token: cookies.GET_TOKEN(),
}

const mutations = {
  ...make.mutations(state),
  RESET_INFO (state) {
    state.info  = {};
    state.token = null;
  }
}

const actions = {
  async getInfo ({commit}) {
    const { data } = await api.get('auth/me');
    commit('info', data.data.user);
  },
  async login ({ commit }, credentials) {
    const response = await api.post('auth/login', credentials)

    cookies.SET_TOKEN(response.data.data.token)
    commit('token', response.data.data.token)
    // commit('info', response.data.user);
  },
  async logout ({ commit, dispatch }) {
    dispatch('app/setOverlay', true, { root: true});
    await api.get('auth/logout');
    cookies.REMOVE_USER();
    resetRouter();
    commit('RESET_INFO');
    // dispatch('app/setMenuApp', [], { root: true});
    // dispatch('permissions/SET_ROUTES', [], { root: true});
  },

  closeSession ({commit}) {
    cookies.REMOVE_USER();
    commit('RESET_INFO');
    resetRouter();
  },

  deleteInfo ({commit}) {
    commit('info', {});
    resetRouter();
  }
}

const getters = {
  ...make.getters(state),
  authenticated (state) {
    return state.token !== null
  },
  infoBasic (state) {

    const { usuario: username, email, fullName, departamento } = state.info

    return state.info.id
      ? { username, email, fullName, departamento }
      : ''
  },
  departamento (state) {
    const { departamento_id, departamento } = state.info

    return state.info.id
      ? { departamento_id, departamento }
      : ''
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
