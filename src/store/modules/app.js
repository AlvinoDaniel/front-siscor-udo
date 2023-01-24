// Pathify
import { make } from 'vuex-pathify'
import { bandeja } from '@/services/bandejas'
// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  gutters: true,
  overlay: false,
  menuApp: [],
  items: [
    {
      title: 'Recibidos',
      icon: 'mdi-email-open-outline',
      to: '/recibidos',
      meta: {
        badge: null,
      },
    },
    {
      title: 'Enviados',
      icon: 'mdi-send-outline mdi-rotate-315',
      to: '/enviados',
    },
    {
      title: 'Por Corregir',
      meta: {
        badge: null,
      },
      icon: 'mdi-email-edit-outline',
      to: '/por-corregir',
    },
    {
      title: 'Borradores',
      icon: 'mdi-text-box-outline',
      to: '/borradores',
    },

  ],
  statusClient:{
    rojo: '#FF353E',
    amarillo: '#FB8C00',
    verde: '#009B35'
  }
}

const mutations = {
  ...make.mutations(state),
  NEW_DOCUMENTS(state, news){
    let { meta } = state.items[0]
    meta.badge = news
  },

  NEW_DOCUMENTS_CORRECT(state, news){
    let { meta } = state.items[2]
    meta.badge = news
  }

}

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
  async getNewDocuments ({commit, rootGetters}) {
    const data  = await bandeja();
    const { rol } = rootGetters['user/info']
    const IS_JEFE = rol === 'jefe'

    commit('NEW_DOCUMENTS', data.recibidos);
    if(IS_JEFE)
      commit('NEW_DOCUMENTS_CORRECT', data.por_corregir);
  },
}

const getters = {
  overlay(state){
    return state.overlay;
  },
  items(state){
    return state.items;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
