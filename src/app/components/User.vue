<style>
  @load "Features.css";

  .user-input {
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;

    input {
      margin-left: 0.5rem;
    }
  }

  .invalid {
    border-color: #F44336;
  }

  .clear {
    @extend %base-button;
    background: #F44336;
  }

  .okay {
    @extend %base-button;
    background: #4CAF50;
  }

  .error {
    background: #F44336;
  }
</style>

<template>
  <message-box>
    <template slot="title">Hello {{firstName}} {{lastName}}!</template>
    <ul v-if="usernameInvalid" css-module="error">
      <li v-for="item in usernameInvalidList">
        {{translation[item.error]}}
      </li>
    </ul>
    <div css-module="user-input">
      <label>
        Firstname
        <input :value="firstName" @input="updateFirstnameInput" :class="{['invalid-'+hash]: firstnameInvalid}">
      </label>
      <template v-if="firstnameInvalid">
        <div v-for="item in firstnameInvalidList">
          {{translation[item.error]}} above
        </div>
      </template>
    </div>
    <div css-module="user-input">
      <label>
        Lastname
        <input :value="lastName" @input="updateLastnameInput" :class="{['invalid-'+hash]: lastnameInvalid}">
      </label>
      <template v-if="lastnameInvalid">
        <div v-for="item in lastnameInvalidList">
          {{translation[item.error]}} above
        </div>
      </template>
    </div>
    <button slot="buttonbar" css-module="clear" @click="clearInput">Clear input</button>
    <button slot="buttonbar" css-module="okay" :disabled="usernameInvalid ? 'disabled' : null">Save</button>
  </message-box>
</template>

<script>
  import template from "./User.html"
  import config from "./User.json!json"
  import {
    updateFirstname,
    updateLastname
  } from "app/vuex/actions"

  const languageMap = {
    FIRSTNAME_NO_VALUE: "Please enter your first name",
    LASTNAME_NO_VALUE: "Please enter your last name"
  }

  export default {
    template: template,

    data: () =>
    {
      return {
        translation: languageMap
      }
    },

    methods: {
      updateFirstnameInput(e) { this.updateFirstname(e.target.value) },
      updateLastnameInput(e) { this.updateLastname(e.target.value) },
      clearInput() {
        this.updateFirstname("")
        this.updateLastname("")
      }
    },

    computed: {
      usernameInvalid() { return this.usernameInvalidList.length > 0 },
      firstnameInvalid() { return this.firstnameInvalidList.length > 0 },
      lastnameInvalid() { return this.lastnameInvalidList.length > 0 },

      hash: () => config.hash
    },

    vuex: {
      getters: {
        firstName: (state) => state.user.firstname,
        lastName: (state) => state.user.lastname
      },

      actions: {
        updateFirstname,
        updateLastname
      }
    },

    validators: {
      usernameInvalidList: (validator) => validator.isInvalid("user"),
      firstnameInvalidList: (validator) => validator.isInvalid("user.firstname"),
      lastnameInvalidList: (validator) => validator.isInvalid("user.lastname")
    }
  }
</script>
