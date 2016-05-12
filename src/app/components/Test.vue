<style>
  @import "Features.css";

  .message {
    border: 2px solid #333;
    background: #eee;
    padding: 1rem;
  }

  .title {
    font-size: 3rem;
    margin-top: 0;
    border-bottom: 2px solid #333;
  }

  .buttonbar {
    width: auto;
    background: white;
    padding: 0.5rem;
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
