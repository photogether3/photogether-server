import vine from '@vinejs/vine'

export const emailTakenValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)