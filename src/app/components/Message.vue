<style>
  @import "Features.css";

  .message {
    border: 2px solid #333;
    background: #eee;
    max-width: 25rem;

    p{
      padding: 0 1rem;
    }
  }

  .title {
    margin-top: 0;
    border-bottom: 1px solid #333;
    padding: 1rem;
    background: #335;
    color: white;
    @extend %inverted-text;
  }

  .buttonbar {
    width: auto;
    background: white;
    padding: 0.5rem;
    text-align: right;
    border-top: 1px solid #333;

    > *:not(:first-child){
      margin-left: 0.5rem;
    }
  }

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
  <div css-module="message">
    <h1 css-module="title">{{title}}</h1>
    <p>{{text}}</p>
    <p>Base Size: {{base}}</p>
    <div css-module="buttonbar">
      <button css-module="cancel">Cancel</button>
      <button css-module="okay">Save</button>
    </div>
  </div>
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
