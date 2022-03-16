import axios from 'axios'
const state = {
  allDelivery: '',
  delivery: {},
  deliveryAlert: { msg: '', val: false },
  insLoader: true,
}

const actions = {
  async getDelivery ({ rootState, commit, state }, { id = false, filter = {} }) {
    const apiUrl = id ? rootState.API_URL + `delivery/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `delivery?timestamp=${new Date().getTime()}`
    axios.get(
      apiUrl,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
        params: filter,
      },
    ).then((resp) => {
      const data = resp.data.data
      if (resp.data.success) {
        if (id) commit('FETCH_SINGLE_DELIVERY', data)
        else commit('FETCH_DELIVERY', data)
        return true
      }
      state.insLoader = false
      commit('BOOK_MSG', { val: true, msg: resp.data.data })
      return false
    }).catch((error) => {
      if (error) {
        commit('FETCH_DELIVERY', [])
        commit('BOOK_MSG', { val: true, msg: error.response.data })
      }
      state.insLoader = false
      return false
    })
  },

  async updateDelivery ({ rootState, commit }, { data, id = false }) {
    const apiUrl = id ? rootState.API_URL + `delivery/update/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `delivery/add/?timestamp=${new Date().getTime()}`
    axios.post(
      apiUrl,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('DEIVERY_MSG', { val: true, msg: data.data }) }
      state.insLoader = true
      return commit('DEIVERY_MSG', { val: false, msg: data.data })
    }).catch((error) => {
      commit('DEIVERY_MSG', { val: true, msg: error.response.data })
    })
  },

  async deleteDelivery ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `delivery/delete/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('DEIVERY_MSG', { val: true, msg: data.data }) }
      const { allDelivery } = state
      const insInd = allDelivery.findIndex(elem => id === elem.Id)
      commit('DEIVERY_MSG', { val: false, msg: data.data })
      allDelivery.splice(insInd, 1)
      return commit('FETCH_DELIVERY', allDelivery)
    }).catch((error) => {
      commit('DEIVERY_MSG', { val: true, msg: error.response })
    })
  },
}

const mutations = {
  FETCH_DELIVERY: (state, data) => (state.allDelivery = data),
  FETCH_SINGLE_DELIVERY: (state, data) => (state.delivery = data),
  DEIVERY_MSG: (state, data) => (state.deliveryAlert = data),
}

const getters = {
  allDelivery: (state) => state.allDelivery,
  delivery: (state) => state.delivery,
  deliveryAlert: (state) => state.deliveryAlert,
}

export default { state, getters, actions, mutations }
