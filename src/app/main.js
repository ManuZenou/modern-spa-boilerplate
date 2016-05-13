import Vue from "vue"
import MessageComponent from "app/components/Message"
import TableComponent from "app/components/Table"

console.log("Hello from app/main")

Vue.component("message-component", MessageComponent)
Vue.component("table-component", TableComponent)

var root = new Vue({
  el: "#vue-root"
})
