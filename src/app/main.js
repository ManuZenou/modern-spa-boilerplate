import Vue from "vue"
import TestComponent from "app/components/Test"
import TableComponent from "app/components/Table"

console.log("Hello from app/main")

Vue.component("test-component", TestComponent)
Vue.component("table-component", TableComponent)

var root = new Vue({
  el: "#vue-root"
})
