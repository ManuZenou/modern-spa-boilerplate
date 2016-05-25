import {
  UPDATE_USER_FIRSTNAME,
  UPDATE_USER_LASTNAME
} from "app/vuex/mutation-types"

const state = {
  firstname: "Unknown",
  lastname: "User"
}

const mutations = {
  [UPDATE_USER_FIRSTNAME](currentState, firstName)
  {
    currentState.firstname = firstName
  },

  [UPDATE_USER_LASTNAME](currentState, lastName)
  {
    currentState.lastname = lastName
  }
}

export default {
  state,
  mutations
}
