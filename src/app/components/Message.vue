<style>
  @import "Features.css";

  .message {
    border: 2px solid #333;
    background: #eee;

    p{
      padding: 1rem;
    }
  }

  .title {
    font-size: 2rem;
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
    <div css-module="buttonbar">
      <button css-module="cancel">Cancel</button>
      <button css-module="okay">Save</button>
    </div>
  </div>
</template>

<script>
  import template from "./Message.html"
  export default {
    template: template,
    data: function()
    {
      return {
        title: "Message Box",
        text: "Your data was saved successfully!"
      }
    }
  }
  console.log("Debug from Message.js")
</script>
