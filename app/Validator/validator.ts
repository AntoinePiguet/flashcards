import vine from '@vinejs/vine'

const loginUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string().minLength(4),
  })
)

const registerUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(30)
      .unique({ table: 't_user', column: 'username' }),

    password: vine.string().minLength(6),
  })
)

export { loginUserValidator, registerUserValidator }
