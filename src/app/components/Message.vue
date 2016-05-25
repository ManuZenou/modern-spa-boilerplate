<style>
  @import "Features.css";

  .cancel {
    @extend %base-button;
    background: #F44336;
  }

  .okay {
    @extend %base-button;
    background: #4CAF50;
  }
</style>

<template>
  <message-box>
    <template slot="title">{{title}}</template>
    <p>{{text}}</p>
    <p>Base Size: {{base}}</p>
    <button slot="buttonbar" css-module="cancel">Cancel</button>
    <button slot="buttonbar" css-module="okay">Save</button>
  </message-box>
</template>

<script>
  var shared = {
    title: "Message Box",
    text: "Your data was successfully parsed!",
    base: 0
  }

  import template from "./Message.html"
  export default {
    template: template,
    data: function() {
      return shared
    }
  }
  console.log("Debug from Message.js")

  function update() {
    shared.base = getComputedStyle(document.documentElement).fontSize
  }

  window.addEventListener("resize", update, true);
  window.addEventListener("orientationchange", update, true);

  update();
</script>
