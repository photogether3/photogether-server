import User from '#models/user'
import { ProfileViewModel } from '#models/views/user.vm'
import { emailTakenValidator, UpdatePasswordByOtpDto, updatePasswordByOtpValidator, UpdatePasswordDto, updatePasswordValidator, UpdateUserDto, updateUserValidator, UserDataResetDto, WithdrawDto, withdrawValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserApiController {

  async isEmailTaken({ request }: HttpContext) {
    const emailParam = request.param('email')
    const { email } = await emailTakenValidator.validate({ email: emailParam })
    const isDuplicated = !!await User.findBy('email', email)
    return { isDuplicated }
  }

  async profile({ user }: HttpContext) {
    return new ProfileViewModel(user).toJson()
  }

  async updateProfile({ request, user, uploadedFileUrl }: HttpContext) {
    const dto: UpdateUserDto = await request.validateUsing(updateUserValidator)

    user = await user.merge({
      nickname: dto.nickname,
      bio: dto.bio ?? null,
      imageUrl: uploadedFileUrl
    }).save()

    return new ProfileViewModel(user).toJson()
  }

  async updatePasswordByOtp({ request }: HttpContext) {
    const dto: UpdatePasswordByOtpDto = await request.validateUsing(updatePasswordByOtpValidator)
    await User.updatePasswordByOtp(dto)
  }

  async updatePassword({ user, request }: HttpContext) {
    const dto: UpdatePasswordDto = await request.validateUsing(updatePasswordValidator)
    await user.updatePassword(dto)
  }

  async reset({ user, request }: HttpContext) {
    const dto: UserDataResetDto = await request.validateUsing(withdrawValidator)
    await user.resetData(dto.otp)
  }

  async withdraw({ user, request }: HttpContext) {
    const dto: WithdrawDto = await request.validateUsing(withdrawValidator)
    await user.withdraw(dto.otp)
  }
}