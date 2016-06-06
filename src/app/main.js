// Waiting for JSPM fix
/*

import intl_en from "intl/locale-data/json/en.json"
import intl_de from "intl/locale-data/json/de.json"
import intl_fr from "intl/locale-data/json/fr.json"
import intl_es from "intl/locale-data/json/es.json"

IntlPolyfill.__addLocaleData(intl_en)
IntlPolyfill.__addLocaleData(intl_de)
IntlPolyfill.__addLocaleData(intl_fr)
IntlPolyfill.__addLocaleData(intl_es)

import IntlRelativeFormat from "intl-relativeformat"

import relative_en from "vue-locale/data/en.js"
import relative_de from "vue-locale/data/de.js"
import relative_fr from "vue-locale/data/fr.js"
import relative_es from "vue-locale/data/es.js"

IntlRelativeFormat.__addLocaleData(relative_en)
IntlRelativeFormat.__addLocaleData(relative_de)
IntlRelativeFormat.__addLocaleData(relative_fr)
IntlRelativeFormat.__addLocaleData(relative_es)

console.log("I18N: ", intl_de)
*/

import Vue from "vue"

import MessageComponent from "app/components/Message"
import TableComponent from "app/components/Table"
import UserComponent from "app/components/User"
import MessageBoxComponent from "app/components/MessageBox"

// Waiting for JSPM fix
/*

const SELECTED_LANGUAGE = "de"
const SELECTED_CURRENCY = "EUR"
const MESSAGE_TEXTS = {
  "my-message-identifier": "Hallo Welt!",
  "my-html-identifier": "Hallo <b>Welt</b>!",
  "my-personal-identifier": "Hallo {name}!"

}

import VueLocale from "vue-locale"

Vue.use(VueLocale,
{
  language: SELECTED_LANGUAGE,
  currency: SELECTED_CURRENCY,
  messages: MESSAGE_TEXTS
})
*/

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
var AppComponent = Vue.extend({
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
router.map(
{
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
router.start(AppComponent, '#vue-root')
