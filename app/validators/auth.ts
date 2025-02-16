import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const generateOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().minLength(6).maxLength(6)
  })
)
