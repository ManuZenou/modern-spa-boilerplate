import Vue from "vue"
import Vuex from "vuex"

import user from "app/vuex/modules/user"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  }
})
