/* eslint-disable no-tabs */
import axios from 'axios'
const state = {
  token: localStorage.getItem('auth-token') || false,
  user: { id: '', role: '' },
  loggedin: localStorage.getItem('loggedin') === 'true',
  userDetails: {},
  userAlert: { msg: '', val: false },
  sendKey: '',
}

const actions = {
  async login ({ rootState, commit }, data) {
    commit('ERROR', { status: false, msg: '' })
		axios.post(
			rootState.API_URL + `login?timestamp=${new Date().getTime()}`,
			data,
    ).then(({ data }) => {
      if (!data.success) {
         commit('ERROR', { status: false, msg: data.data })
      }
      localStorage.setItem('auth-token', data.data.token)
      localStorage.setItem('loggedin', true)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      commit('LOGIN', data.data)
    }).catch((error) => {
      if (error) { commit('ERROR', { status: true, msg: error.response ? error.response.data.data : 'Something went wrong' }) }
  })
  },
  async register ({ rootState, commit }, data) {
    commit('ERROR', { status: false, msg: '' })
    data.redirect = window.location.href + '/confirm'
		axios.post(
			rootState.API_URL + `register?timestamp=${new Date().getTime()}`,
			data,
    ).then(({ data }) => {
      if (!data.success) {
        commit('ERROR', { status: true, msg: data.data })
      }
      commit('SEND_KEY')
    }).catch((error) => {
      if (error) { commit('ERROR', { status: true, msg: error.response ? error.response.data.data : 'Something went wrong' }) }
    })
  },
  async confirmation ({ rootState, commit }, data) {
		axios.post(
			rootState.API_URL + `activation_key?timestamp=${new Date().getTime()}`,
			data,
    ).then(({ data }) => {
      if (!data.success) {
        commit('ERROR', { status: true, msg: data.data })
      }
    }).catch((error) => {
      if (error) { commit('ERROR', { status: true, msg: error.response ? error.response.data.data : 'Something went wrong' }) }
    })
  },
  async myProfile ({ rootState, commit }) {
		axios.get(
			rootState.API_URL + `user/me?timestamp=${new Date().getTime()}`,
      { headers: { token: localStorage.getItem('auth-token') } },
    ).then(({ data }) => {
      if (!data.success) {
         commit('ERROR', { val: true, msg: data.data })
      }
      commit('FETCH_USER', data.data)
    }).catch((error) => {
      if (error) { commit('ERROR', { val: true, msg: error.response ? error.response.data.data : 'Something went wrong' }) }
  })
  },
  async userDetail ({ rootState, state, commit }, id = state.user.id) {
		axios.get(
			rootState.API_URL + `user/details/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) {
         commit('FETCH_USER', { val: true, msg: data.data })
      }
      commit('FETCH_USER', data.data)
    }).catch((error) => {
      if (error) { commit('USER_MSG', { val: true, msg: error.response ? error.response.data.data : 'Something went wrong' }) }
  })
  },
  async updateUser ({ rootState, commit }, { data, id }) {
    const apiUrl = id ? rootState.API_URL + `user/update/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `user/insert?timestamp=${new Date().getTime()}`
		axios.post(
			apiUrl,
			data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) {
        commit('API_RESPONSE', { status: false, msg: data.data })
        return commit('ERROR', { status: true, msg: data.data })
      } else {
        commit('API_RESPONSE', { status: true, msg: data.data })
      }
      commit('ERROR', { status: false, msg: data.data })
    }).catch((error) => {
      if (error) {
        commit('API_RESPONSE', { status: false, msg: error.response ? error.response.data.data : 'Something went wrong' })
        commit('ERROR', { status: true, msg: error.response ? error.response.data.data : 'Something went wrong' })
      } else {
        commit('API_RESPONSE', { status: false, msg: data.data })
      }
  })
  },
  async logout ({ commit }) {
    localStorage.clear()
    commit('LOGOUT')
	},
}

const mutations = {
  LOGIN: (state, { token, user }) => {
    state.token = token
    state.user = user
    state.loggedin = true
  },
  LOGOUT: (state) => {
    state.token = ''
    state.user = { id: '', role: '' }
    state.loggedin = false
  },
  SEND_KEY: (state) => (state.sendKey = true),
  USER_UPDATED: (state, user) => (state.userAlert = user),
  FETCH_USER: (state, user) => (state.userDetails = user),
  USER_MSG: (state, data) => (state.userAlert = data),
}

const getters = {
  loggedin: (state) => state.loggedin || localStorage.getItem('loggedin') === 'true',
  token: (state) => state.token || localStorage.getItem('auth-token'),
  user: () => JSON.parse(localStorage.getItem('user')),
  sendKey: (state) => state.sendKey,
  userAlert: (state) => state.userAlert,
  userDetails: (state) => state.userDetails,
}

export default {
  state,
  getters,
	actions,
	mutations,
}
