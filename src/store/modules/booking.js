import axios from 'axios'
const state = {
  allBookings: [],
  booking: {},
  bookAlert: { msg: '', val: false },
  insLoader: true,
  sections: {
    movedetails: {},
    customerdetails: {},
    billingdetails: [{ fields: {}, additional: 'no', sameinfo: 'no' }],
    shipmentdetails: { moveItems: {} },
    deliverydetails: { isDelivery: 'no', deliveryAddress: {} },
    comment: { comment: '', findUs: '', military: 'no' },
    tnc: {},
  },
}

const actions = {
  async getBookings ({ rootState, commit, state }, { id = false, filter = {} }) {
    const apiUrl = id ? rootState.API_URL + `bookings/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `bookings?timestamp=${new Date().getTime()}`
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
      console.log(data)
      if (resp.data.success) {
        if (id) commit('FETCH_SINGLE_BOOKING', data)
        else commit('FETCH_BOOKINGS', data)
        return true
      }
      state.insLoader = false
      commit('BOOK_MSG', { val: true, msg: resp.data.data })
      return false
    }).catch((error) => {
      commit('FETCH_BOOKINGS', [])
      if (error) { commit('BOOK_MSG', { val: true, msg: error.response.data }) }
      state.insLoader = false
      return false
    })
  },

  async updateBooking ({ rootState, commit }, { data, id = false }) {
    const apiUrl = id ? rootState.API_URL + `bookings/update/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `bookings/add/?timestamp=${new Date().getTime()}`
    axios.post(
      apiUrl,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('BOOK_MSG', { val: true, msg: data.data }) }
      state.insLoader = true
      return commit('BOOK_MSG', { val: false, msg: data.data })
    }).catch((error) => {
      commit('BOOK_MSG', { val: true, msg: error.response.data })
    })
  },

  async deleteBooking ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `bookings/delete/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('BOOK_MSG', { val: true, msg: data.data }) }
      const { allBookings } = state
      const insInd = allBookings.findIndex(elem => id === elem.Id)
      commit('BOOK_MSG', { val: false, msg: data.data })
      allBookings.splice(insInd, 1)
      return commit('FETCH_BOOKINGS', allBookings)
    }).catch((error) => {
      commit('BOOK_MSG', { val: true, msg: error.response })
    })
  },
}

const mutations = {
  FETCH_BOOKINGS: (state, data) => (state.allBookings = data),
  FETCH_SINGLE_BOOKING: (state, data) => (state.booking = data),
  BOOK_MSG: (state, data) => (state.bookAlert = data),
  BOOKING_UPDATE_SECTIONS: async (state, data) => (state.sections = data),
}

const getters = {
  allBookings: (state) => state.allBookings,
  booking: (state) => state.booking,
  bookAlert: (state) => state.bookAlert,
  bookingSections: (state) => state.sections,
}

export default { state, getters, actions, mutations }
