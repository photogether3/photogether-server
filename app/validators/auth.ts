import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)
export type LoginDto = Infer<typeof loginValidator>

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)
export type RegisterDto = Infer<typeof registerValidator>

export const generateOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)
export type GenerateOtpDto = Infer<typeof generateOtpValidator>

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().minLength(6).maxLength(6)
  })
)
export type VerifyOtpDto = Infer<typeof verifyOtpValidator>
