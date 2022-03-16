import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import doc from './modules/doc'
import insurance from './modules/insurance'
import bookings from './modules/booking'
import delivery from './modules/delivery'
import notification from './modules/notification'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    darkMode: localStorage.getItem('dark-mode') === 'true',
    API_URL: 'https://www.earthrelocation.com/wp-json/wm_api/v1/',
    error: { status: false, msg: '' },
    apiResponse: { status: false, msg: '' },
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    ERROR: (state, { status, msg }) => (state.error = { status, msg }),
    API_RESPONSE: (state, { status, msg }) => (state.apiResponse = { status, msg }),
    SET_THEME: (state, status) => {
      state.darkMode = status
      localStorage.setItem('dark-mode', status)
    },
  },
  actions: {
  },
  getters: {
    error: (state) => state.error,
    apiResponse: (state) => state.apiResponse,
  },
  modules: {
    auth,
    doc,
    insurance,
    bookings,
    delivery,
    notification,
    users,
  },
})
