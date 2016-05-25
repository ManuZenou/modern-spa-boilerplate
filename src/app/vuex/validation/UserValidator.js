import { BaseValidator } from "vuex-validator"

class UserValidator extends BaseValidator
{
  constructor()
  {
    super("user")

    this.rule("user-name", [ "user.firstname", "user.lastname" ], this.userName)
  }

  userName(state)
  {
    if (typeof (state.user.firstname) !== "string")
      this.invalid([ "user.firstname" ], "FIRSTNAME_NOT_A_STRING")
    if (typeof (state.user.lastname) !== "string")
      this.invalid([ "user.lastname" ], "LASTNAME_NOT_A_STRING")

    if (state.user.firstname.length < 2)
      this.invalid([ "user.firstname" ], "FIRSTNAME_NO_VALUE")

    if (state.user.lastname.length < 2)
      this.invalid([ "user.lastname" ], "LASTNAME_NO_VALUE")

    return this.errors()
  }
}

export default new UserValidator()
