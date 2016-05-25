import Vue from "vue"
import MessageComponent from "app/components/Message"
import TableComponent from "app/components/Table"
import UserComponent from "app/components/User"
import MessageBoxComponent from "app/components/MessageBox"

import { VuexValidator } from "vuex-validator"
import validators from "app/vuex/validators"
import store from "app/vuex/store"

Vue.use(VuexValidator, {
  validators
})

console.log("Hello from app/main")
console.log("Version: " + (document.documentElement.dataset.version || "dev"))

Vue.component("message-box", MessageBoxComponent)
Vue.component("user-component", UserComponent)
Vue.component("message-component", MessageComponent)
Vue.component("table-component", TableComponent)

new Vue({
  el: "#vue-root",
  store
})
