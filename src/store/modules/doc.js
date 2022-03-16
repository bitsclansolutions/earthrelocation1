/* eslint-disable no-tabs */
import axios from 'axios'
const state = {
  allDocs: [],
  document: {},
  docAlert: { msg: '', val: false },
}

const actions = {
  async getDocs ({ rootState, commit }) {
    axios.get(
      rootState.API_URL + `docs?timestamp=${new Date().getTime()}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then((resp) => {
      if (resp.data.success) { commit('FETCH_DOCS', resp.data.data) }
    }).catch((error) => {
      if (error) { commit('DOC_MSG', { val: true, msg: error.response.data }) }
    })
  },

  async getDocuments ({ rootState, commit }, { id = false, filter = {} }) {
    const apiUrl = id ? rootState.API_URL + `documents/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `documents?timestamp=${new Date().getTime()}`
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
        if (id) commit('FETCH_SINGLE_DOC', data)
        else commit('FETCH_DOCS', data)
        return true
      }
      commit('ERROR', { val: true, msg: resp.data.data })
      return false
    }).catch((error) => {
      if (id) commit('FETCH_SINGLE_DOC', [])
      else commit('FETCH_DOCS', [])
      if (error) { commit('ERROR', { val: true, msg: error.response.data }) }
      return false
    })
  },

  async updateDocument ({ rootState, commit }, { data, id = false }) {
    const apiUrl = id ? rootState.API_URL + `documents/update/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `documents/add/?timestamp=${new Date().getTime()}`
    axios.post(
      apiUrl,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('API_RESPONSE', { status: false, msg: data.data }) }
      return commit('API_RESPONSE', { status: true, msg: data.data })
    }).catch((error) => {
      commit('API_RESPONSE', { status: false, msg: error.response.data })
    })
  },

  async deleteDocument ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `documents/delete/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { commit('API_RESPONSE', { status: false, msg: data.data }) }
      const { allDocs } = state
      const insInd = allDocs.findIndex(elem => id === elem.Id)
      commit('API_RESPONSE', { status: false, msg: data.data })
      allDocs.splice(insInd, 1)
      return commit('FETCH_DOCS', allDocs)
    }).catch((error) => {
      commit('API_RESPONSE', { status: true, msg: error.response })
    })
  },

  async addDoc ({ rootState, commit }, data) {
    axios.post(
      rootState.API_URL + `upload_docs?timestamp=${new Date().getTime()}`,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('DOC_MSG', { val: true, msg: data.data }) }
      commit('FETCH_DOCS', data.data)
    }).catch((error) => {
      commit('DOC_MSG', { val: true, msg: error.response.data })
    })
  },
}

const mutations = {
  FETCH_DOCS: (state, data) => (state.allDocs = data),
  FETCH_SINGLE_DOC: (state, data) => (state.document = data),
  DOC_MSG: (state, data) => (state.docAlert = data),
}

const getters = {
  allDocs: (state) => state.allDocs,
  document: (state) => state.document,
  docAlert: (state) => state.docAlert,
}

export default {
  state,
  getters,
	actions,
	mutations,
}
