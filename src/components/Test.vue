<style>
  .message{
    border: 2px solid red;
  }
  .title {
    font-size: 3em;
  }
  .button.cancel{
    background: red;
  }
  .button.okay{
    background: green;
  }
</style>

<template>
  <div css-module="message">
    <h1 css-module="title">{{msg}}</h1>
    <p>Intro text</p>
    <div css-module="button-bar">
      <button css-module="button.cancel">Cancel</button>
      <button css-module="button.okay">Save</button>
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
