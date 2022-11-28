// Pathify
import { make } from 'vuex-pathify'

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
        badge: 5,
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

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
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
