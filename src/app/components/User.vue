<style>
  .user-input {
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
  }

  .user-input input {
    margin-left: 0.5rem;
  }
</style>

<template>
  <div css-module="user-input">
    <h2>Hello {{firstName}} {{lastName}}!</h2>
    <div><label>Firstname<input :value="firstName" @input="updateFirstnameInput"></label></div>
    <div><label>Lastname<input :value="lastName" @input="updateLastnameInput"></label></div>
    <div><button @click="clearInput">Clear input</button></div>
    <div v-for="item in usernameInvalid">
      {{item}}
    </div>
  </div>
</template>

<script>
  import template from "./User.html"
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

    methods: {
      updateFirstnameInput(e) { this.updateFirstname(e.target.value) },
      updateLastnameInput(e) { this.updateLastname(e.target.value) },
      clearInput() {
        this.updateFirstname("")
        this.updateLastname("")
      }
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
      usernameInvalid: (validator) => (validator.isInvalid("user") || []).map((inv) => languageMap[inv.error])
    }
  }
</script>
