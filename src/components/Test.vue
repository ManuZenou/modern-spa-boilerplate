<style>
  @import "Features.css";

  .message {
    border: 2px solid red;
  }

  .title {
    font-size: 3em;
  }

  .buttonbar {
    width: auto;
  }

  .cancel {
    @extend %base-button;
    background: red;
  }

  .okay {
    @extend %base-button;
    background: green;
  }
</style>

<template>
  <div css-module="message">
    <h1 css-module="title">{{msg}}</h1>
    <p>Intro text</p>
    <div css-module="buttonbar">
      <button css-module="cancel">Cancel</button>
      <button css-module="okay">Save</button>
    </div>
  </div>
</template>

<script>
  import template from "./Test.html"
  export default {
    template: template,
    data: function()
    {
      return {
        msg: "Hello world!"
      }
    }
  }
  console.log("Debug from Test.js")
</script>
