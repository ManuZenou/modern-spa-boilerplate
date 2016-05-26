<style>
  @load "Features.css";

  .message {
    border: 2px solid #333;
    background: #eee;
    max-width: 25rem;

    p{
      padding: 0 1rem;
    }

    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .title {
    margin-top: 0;
    padding: 0.5rem 1rem;
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
    <h1 css-module="title"><slot name="title"></slot></h1>
    <slot></slot>
    <div css-module="buttonbar">
      <slot name="buttonbar"></slot>
    </div>
  </div>
</template>

<script>
  import template from "./MessageBox.html"
  export default {
    template: template,
  }
</script>
