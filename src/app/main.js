import Vue from "vue"

import MessageComponent from "app/components/Message"
import TableComponent from "app/components/Table"
import UserComponent from "app/components/User"
import MessageBoxComponent from "app/components/MessageBox"

import VueRouter from "vue-router"

Vue.use(VueRouter)

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

// The router needs a root component to render.
// For demo purposes, we will just use an empty one
// because we are using the HTML as the app template.
// !! Note that the App is not a Vue instance.
var App = Vue.extend({
  //el: "#vue-root",
  store
})

// Create a router instance.
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter()

// Define some routes.
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
router.map({
  '/user': {
    component: UserComponent
  },
  '/message': {
    component: MessageComponent
  },
  '/table': {
    component: TableComponent
  }
})

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
router.start(App, '#vue-root')
