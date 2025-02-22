import UserApiService from '#services/user_api_service'
import { UpdatePasswordByOtpDto, updatePasswordByOtpValidator, UpdatePasswordDto, updatePasswordValidator, UpdateUserDto, updateUserValidator, UserDataResetDto, WithdrawDto, withdrawValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserApiController {

  async isEmailTaken({ request }: HttpContext) {
    const emailParam = request.param('email')
    return await UserApiService.isEmailTaken(emailParam)
  }

  async profile({ user }: HttpContext) {
    return await UserApiService.profile(user)
  }

  async updateProfile({ request, user, uploadedFileUrl }: HttpContext) {
    const dto: UpdateUserDto = await request.validateUsing(updateUserValidator)
    return await UserApiService.updateProfile(user, dto, uploadedFileUrl)
  }

  async updatePasswordByOtp({ request }: HttpContext) {
    const dto: UpdatePasswordByOtpDto = await request.validateUsing(updatePasswordByOtpValidator)
    await UserApiService.updatePasswordByOtp(dto)
  }

  async updatePassword({ user, request }: HttpContext) {
    const dto: UpdatePasswordDto = await request.validateUsing(updatePasswordValidator)
    await UserApiService.updatePassword(user, dto)
  }

  async reset({ user, request }: HttpContext) {
    const dto: UserDataResetDto = await request.validateUsing(withdrawValidator)
    await UserApiService.reset(user, dto)
  }

  async withdraw({ user, request }: HttpContext) {
    const dto: WithdrawDto = await request.validateUsing(withdrawValidator)
    await UserApiService.withdraw(user, dto)
  }
}