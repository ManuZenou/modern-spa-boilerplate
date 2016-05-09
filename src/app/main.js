import Vue from "vue"
import TestComponent from "app/components/Test"

console.log("Hello from app/main")

Vue.component("test-component", TestComponent)
console.log("TestComponent: ", TestComponent)

var root = new Vue({
  el: "#vue-root"
})
