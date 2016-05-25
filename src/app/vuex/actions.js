import {
  UPDATE_USER_FIRSTNAME,
  UPDATE_USER_LASTNAME
} from "app/vuex/mutation-types"

export function updateFirstname({ dispatch }, firstName)
{
  dispatch(UPDATE_USER_FIRSTNAME, firstName)
}
export function updateLastname({ dispatch }, lastName)
{
  dispatch(UPDATE_USER_LASTNAME, lastName)
}
