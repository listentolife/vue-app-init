import * as types from '../mutation-types'

const state = {
  text: '初始状态'
}

const getters = {
  text: state => state.text
}

const mutations = {
  [types.SET_HOME_TEXT] (state, text) {
    state.text = text
  }
}

const actions = {
  asyncChangeText ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit(types.SET_HOME_TEXT, '更新状态')
        resolve()
      }, 2000)
    })
  }
}

const homeModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default homeModule