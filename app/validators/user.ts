import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const emailTakenValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    nickname: vine.string().minLength(2).maxLength(12),
    bio: vine.string().minLength(2).maxLength(50),
    categoryIds: vine.string(),
  })
)
export type UpdateUserDto = Infer<typeof updateUserValidator>

export const updatePasswordByOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().minLength(6).maxLength(6),
    password: vine.string().minLength(8).maxLength(50),
  })
)
export type UpdatePasswordByOtpDto = Infer<typeof updatePasswordByOtpValidator>

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(8).maxLength(50),
    newPassword: vine.string().minLength(8).maxLength(50),
  })
)
export type UpdatePasswordDto = Infer<typeof updatePasswordValidator>

export const userDataResetValidator = vine.compile(
  vine.object({
    otp: vine.string().minLength(6).maxLength(6),
  })
)
export type UserDataResetDto = Infer<typeof userDataResetValidator>

export const withdrawValidator = vine.compile(
  vine.object({
    otp: vine.string().minLength(6).maxLength(6),
  })
)
export type WithdrawDto = Infer<typeof withdrawValidator>