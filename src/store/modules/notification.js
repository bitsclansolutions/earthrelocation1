import axios from 'axios'
const state = {
  allNotifications: [],
  notification: {},
  notificatioAlert: { msg: '', val: false },
  insLoader: true,
}

const actions = {
  async getNotification ({ rootState, commit, state }, { id = false, filter = {} }) {
    const apiUrl = id ? rootState.API_URL + `prealerts/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `prealerts?timestamp=${new Date().getTime()}`
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
        if (id) commit('FETCH_SINGLE_NOTIFICATION', data)
        else commit('FETCH_NOTIFICATION', data)
        return true
      }
      state.insLoader = false
      commit('NOTIFICATION_MSG', { val: true, msg: resp.data.data })
      return false
    }).catch((error) => {
      commit('FETCH_NOTIFICATION', [])
      if (error) { commit('NOTIFICATION_MSG', { val: true, msg: error.response.data }) }
      state.insLoader = false
      return false
    })
  },

  async updateNotification ({ rootState, commit }, { data, id = false }) {
    const apiUrl = id ? rootState.API_URL + `prealerts/update/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `prealerts/add?timestamp=${new Date().getTime()}`
    axios.post(
      apiUrl,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('NOTIFICATION_MSG', { val: true, msg: data.data }) }
      state.insLoader = true
      return commit('NOTIFICATION_MSG', { val: false, msg: data.data })
    }).catch((error) => {
      commit('NOTIFICATION_MSG', { val: true, msg: error.response.data })
    })
  },

  async deleteNotification ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `prealerts/delete/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('NOTIFICATION_MSG', { val: true, msg: data.data }) }
      const { allNotifications } = state
      const insInd = allNotifications.findIndex(elem => id === elem.Id)
      commit('NOTIFICATION_MSG', { val: false, msg: data.data })
      allNotifications.splice(insInd, 1)
      return commit('FETCH_NOTIFICATION', allNotifications)
    }).catch((error) => {
      commit('DEIVERY_MSG', { val: true, msg: error.response })
    })
  },
}

const mutations = {
  FETCH_NOTIFICATION: (state, data) => (state.allNotifications = data),
  FETCH_SINGLE_NOTIFICATION: (state, data) => (state.notification = data),
  NOTIFICATION_MSG: (state, data) => (state.notificatioAlert = data),
}

const getters = {
  allNotifications: (state) => state.allNotifications,
  notification: (state) => state.notification,
  notificatioAlert: (state) => state.notificatioAlert,
}

export default { state, getters, actions, mutations }
