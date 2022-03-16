import axios from 'axios'
const state = {
  allUsers: [],
  singleUser: {},
  usersAlert: { msg: '', val: false },
  insLoader: true,
}

const actions = {
  async getUsers ({ rootState, commit, state }) {
    const apiUrl = rootState.API_URL + `users?timestamp=${new Date().getTime()}`
    axios.get(
      apiUrl,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then((resp) => {
      const data = resp.data.data
      if (resp.data.success) {
         commit('FETCH_USERS', data)
        return true
      }
      state.insLoader = false
      commit('USER_MSG', { val: true, msg: resp.data.data })
      return false
    }).catch((error) => {
      if (error) { commit('USER_MSG', { val: true, msg: error.response.data }) }
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
      if (!data.success) { return commit('USER_MSG', { val: true, msg: data.data }) }
      state.insLoader = true
      return commit('USER_MSG', { val: false, msg: data.data })
    }).catch((error) => {
      commit('USER_MSG', { val: true, msg: error.response.data })
    })
  },

  async deleteUser ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `user/delete/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('ERROR', { status: true, msg: data.data }) }
      const { allUsers } = state
      const insInd = allUsers.findIndex(elem => id === elem.Id)
      commit('ERROR', { status: false, msg: data.data })
      allUsers.splice(insInd, 1)
      return commit('FETCH_USERS', allUsers)
    }).catch((error) => {
      commit('ERROR', { status: true, msg: error.response })
    })
  },
}

const mutations = {
  FETCH_USERS: (state, data) => (state.allUsers = data),
  FETCH_SINGLE_NOTIFICATION: (state, data) => (state.notification = data),
  USER_MSG: (state, data) => (state.userAlert = data),
}

const getters = {
  allUsers: (state) => state.allUsers,
  singleUser: (state) => state.singleUser,
  usersAlert: (state) => state.usersAlert,
}

export default { state, getters, actions, mutations }
