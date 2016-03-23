<style>
  .message{
    border: 2px solid red;
  }
  .title {
    font-size: 3em;
  }
  .buttonbar{
    width: auto;
  }
  .cancel{
    background: red;
  }
  .okay{
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

<!-- Ho? -->
<script>
  export default {
    data: function () {
      return {
        msg: 'Hello world!'
      }
    }
  }
</script>
