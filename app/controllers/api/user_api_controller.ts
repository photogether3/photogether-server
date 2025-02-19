import Category from '#models/category'
import { UserDto } from '#models/dto/user.dto'
import Post from '#models/post'
import User from '#models/user'
import UserToken from '#models/user_token'
import { emailTakenValidator, UpdatePasswordByOtpDto, updatePasswordByOtpValidator, UpdatePasswordDto, updatePasswordValidator, UpdateUserDto, updateUserValidator, UserDataResetDto, WithdrawDto, withdrawValidator } from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class UserApiController {

  async isEmailTaken({ request }: HttpContext) {
    const emailParam = request.param('email')
    const { email } = await emailTakenValidator.validate({ email: emailParam })
    const isDuplicated = !!await User.findBy('email', email)
    return { isDuplicated }
  }

  async profile({ user }: HttpContext) {
    return new UserDto(user).toProfile()
  }

  async updateProfile({ request, user, uploadedFileUrl }: HttpContext) {
    const dto: UpdateUserDto = await request.validateUsing(updateUserValidator)
    const categoryIds: number[] = JSON.parse(dto.categoryIds)
    console.log(categoryIds)

    user = await user.merge({
      nickname: dto.nickname,
      bio: dto.bio,
      imageUrl: uploadedFileUrl
    }).save()

    return new UserDto(user).toProfile()
  }

  async updatePasswordByOtp({ request }: HttpContext) {
    // 유효성 검사
    const dto: UpdatePasswordByOtpDto = await request.validateUsing(updatePasswordByOtpValidator)

    // 이미 존재하는 이메일인지 확인
    let user = await User.findBy('email', dto.email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }

    // OTP 인증 코드 확인
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }

    // 비밀번호 변경
    await user.withUpdatePassword(dto.password)
  }

  async updatePassword({ user, request }: HttpContext) {
    // 유효성 검사
    const dto: UpdatePasswordDto = await request.validateUsing(updatePasswordValidator)

    // 기존 비밀번호 확인
    if (!await user.verifyPassword(dto.currentPassword)) {
      throw new Exception('기존 비밀번호와 일치하지 않습니다', { status: 400, code: 'E_INVALID_PASSWORD' })
    }

    // 비밀번호 변경
    await user.withUpdatePassword(dto.newPassword)
  }

  async reset({ user, request }: HttpContext) {
    const dto: UserDataResetDto = await request.validateUsing(withdrawValidator)
    // OTP 인증 코드 확인
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }

    // 사용자 데이터 삭제
    const trx = await db.transaction()
    await Category.query({ client: trx }).where('user_id', user.id).delete()
    await Post.query({ client: trx }).where('user_id', user.id).delete()
    await UserToken.query({ client: trx }).where('user_id', user.id).delete()
  }

  async withdraw({ user, request }: HttpContext) {
    const dto: WithdrawDto = await request.validateUsing(withdrawValidator)
    // OTP 인증 코드 확인
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }

    await user.delete()
  }
}