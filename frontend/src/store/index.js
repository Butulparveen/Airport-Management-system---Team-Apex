import { createStore } from 'vuex'

export default createStore({
  state: {
    payload: {},
    airline: '',
    userType: '',
    name: ''
  },
  getters: {
    users (state) {
      // state variable contains our state data
        return state.users;
    },
    userData (state) {
      return state.payload;
    }
  },
  mutations: {
    UPDATE_FAVORITES(state, payload) {
      state.payload = payload
    }
  },
  actions: {
    changeData(context, payload) {
      const user = context.state;
      user.airline = payload.airline;
      user.userType = payload.userType;
      user.name = payload.name;
      context.commit('UPDATE_FAVORITES', payload)
    }
  },
  modules: {
  }
})
