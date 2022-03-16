import axios from 'axios'
const state = {
  totalAmount: 0,
  coverageCost:0,
  totalDeductible: 0,
  allInsurance: [],
  insurance: {},
  coverageAmt: 0,
  insAlert: { msg: '', val: false },
  insLoader: true,
  sections: {
    firstName:'',
    coverageCost:'',
    lastName:'',
    email:'',
    contact: {},
    policy: '',
    noInsurance: false,
    waiver: {},
    volume: '',
    amount: '',
    agreements: {},
    coverageAmt:'',
    totalAmount:'',
    article: [],
    over2500: false,
    items: [],
    isVehicleInsurance: 'no',
    vehicle: [],
    deductible: '',
    coverage: ({ pairs: '', mold: '', electrical: '' }),
    tnc: {},
  },
}

const actions = {
  async getInsurance ({ rootState, commit, state }, { id = false, filter = {} }) {
    const apiUrl = id ? rootState.API_URL + `insurance/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `insurance?timestamp=${new Date().getTime()}`
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
        if (id) commit('FETCH_SINGLE_INSURANCE', data)
        else commit('FETCH_INSURANCE', data)
        console.log('dataa -> single',data)
      }
      state.insLoader = false
    }).catch((error) => {
      commit('FETCH_INSURANCE', [])
      if (error) { commit('DOC_MSG', { val: true, msg: error.response.data }) }
      state.insLoader = false
    })
  },

  async updateInsurance ({ rootState, commit }, { data, id = false }) {
    const apiUrl = id ? rootState.API_URL + `update_insurance/${id}?timestamp=${new Date().getTime()}` : rootState.API_URL + `add_insurance?timestamp=${new Date().getTime()}`
    axios.post(
      apiUrl,
      data,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('DOC_MSG', { val: true, msg: data.data }) }
      state.insLoader = true
      return commit('DOC_MSG', { val: false, msg: data.data })
    }).catch((error) => {
      commit('DOC_MSG', { val: true, msg: error.response.data })
    })
  },

  async deleteInsurance ({ rootState, commit, state }, id) {
    axios.get(
      rootState.API_URL + `delete_insurance/${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          token: localStorage.getItem('auth-token'),
        },
      },
    ).then(({ data }) => {
      if (!data.success) { return commit('DOC_MSG', { val: true, msg: data.data }) }
      const { allInsurance } = state
      const insInd = allInsurance.findIndex(elem => id === elem.Id)
      commit('DOC_MSG', { val: false, msg: data.data })
      allInsurance.splice(insInd, 1)
      return commit('FETCH_INSURANCE', allInsurance)
    }).catch((error) => {
      commit('DOC_MSG', { val: true, msg: error.response })
    })
  },

  async uploadFile ({ rootState }, data) {
    const apiUrl = rootState.API_URL + `insurance/upload_doc/?timestamp=${new Date().getTime()}`
    return axios.post(
        apiUrl,
        data,
        {
          headers: {
            token: localStorage.getItem('auth-token'),
          },
        },
      ).then(({ data }) => {
        return data.success ? data.data : ''
      }).catch((error) => {
        return error
      })
  },

  async setInsuranceFields ({ commit, state }, fields) {
    const sections = state.sections || {}
    for (const field in fields) {
        if (Object.prototype.hasOwnProperty.call(sections, field)) { sections[field] = fields[field] }
    }
    commit('INSURANCE_UPDATE_SECTIONS', sections)
    commit('SET_COVERAGE', fields.coverageAmt || 0)
    commit('SET_INSURANCE_TOTAL_AMOUNT', fields.totalAmount || 0)
    commit('ADD_DEDUCTIBLE', fields.totalDeductible || 0)
  },
  async setVehCoverage ({ commit, dispatch }, data) {
    await commit('VEH_COVERAGE', data)
    dispatch('setCoverage')
  },

  async setMainCoverage ({ commit, dispatch }, data) {
    await commit('MAIN_COVERAGE', data)
    dispatch('setCoverage')
  },

  async setArticleCoverage ({ commit, dispatch }, data) {
    await commit('ART_COVERAGE', data)
    dispatch('setCoverage')
  },

  async setItemCoverage ({ commit, dispatch }, data) {
    await commit('ITEM_COVERAGE', data)
    dispatch('setCoverage')
  },

  async setCoverage ({ state, commit }) {
    const ttlCoverage = Number(state.covMainAmt) + Number(state.covVehAmt) + Number(state.covArtAmt) + Number(state.covItemAmt)
    commit('SET_COVERAGE', ttlCoverage)
  },
}

const mutations = {
  ADD_DEDUCTIBLE: (state, amount) => (state.totalDeductible = amount),
  ADD_VEHICLE_DEDUCTIBLE: (state, amount) => {
    state.vehDedct = Number(amount)
    state.totalDeductible = Number(state.vehDedct) + Number(state.premDedct)
  },
  SET_DEDUCTIBLE: (state, amount) => {
    state.premDedct = Number(amount)
  },
  FETCH_INSURANCE: (state, data) => (state.allInsurance = data),
  FETCH_SINGLE_INSURANCE: (state, data) => (state.insurance = data),
  DOC_MSG: (state, data) => (state.insAlert = data),
  SET_COVERAGE: async (state, data) => (state.coverageAmt = data),
  MAIN_COVERAGE: async (state, data) => (state.covMainAmt = data),
  VEH_COVERAGE: async (state, data) => (state.covVehAmt = data),
  ART_COVERAGE: async (state, data) => (state.covArtAmt = data),
  ITEM_COVERAGE: async (state, data) => (state.covItemAmt = data),
  SET_VEH_AMT: async (state, data) => (state.vehAmt = data),
  INSURANCE_UPDATE_SECTIONS: async (state, data) => (state.sections = data),
  SET_INSURANCE_TOTAL_AMOUNT: async (state, data) => (state.totalAmount = data),
}

const getters = {
  allInsurance: (state) => state.allInsurance,
  insurance: (state) => state.insurance,
  insAlert: (state) => state.insAlert,
  totalDeductible: (state) => state.totalDeductible,
  insurancecoverageAmt: (state) => state.coverageAmt,
  InsurancetotalAmount: (state) => state.totalAmount,
  insuranceSections: (state) => state.sections,
}

export default { state, getters, actions, mutations }
