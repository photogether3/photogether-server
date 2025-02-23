import Category from '#models/category'
import Post from '#models/post'
import User from '#models/user'
import UserToken from '#models/user_token'
import { ProfileViewModel } from '#models/views/user.vm'
import {
  UpdatePasswordByOtpDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserDataResetDto,
  WithdrawDto,
} from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'

export default class UserApiService {
  static async isEmailTaken(email: string) {
    const isDuplicated = !!(await User.findBy('email', email))
    return { isDuplicated }
  }

  static async profile(user: User) {
    return new ProfileViewModel(user).toJson()
  }

  static async updateProfile(user: User, dto: UpdateUserDto, uploadedFileUrl: string | null) {
    user = await user
      .merge({
        nickname: dto.nickname,
        bio: dto.bio ?? null,
        imageUrl: uploadedFileUrl,
      })
      .save()

    return new ProfileViewModel(user).toJson()
  }

  /**
   * @todo 비밀번호를 변경합니다.
   * @throws 계정을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async updatePasswordByOtp(dto: UpdatePasswordByOtpDto) {
    let user = await User.findBy('email', dto.email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', {
        status: 400,
        code: 'E_INVALID_OTP',
      })
    }

    await user.merge({ password: dto.password }).save()
  }

  /**
   * @todo 비밀번호를 변경합니다.
   * @throws 비밀번호가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async updatePassword(user: User, dto: UpdatePasswordDto) {
    if (!(await user.verifyPassword(dto.currentPassword))) {
      throw new Exception('기존 비밀번호와 일치하지 않습니다', {
        status: 400,
        code: 'E_INVALID_PASSWORD',
      })
    }
    await user.merge({ password: dto.newPassword }).save()
  }

  /**
   * @todo 회원의 모든 데이터를 초기화합니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async reset(user: User, dto: UserDataResetDto) {
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', {
        status: 400,
        code: 'E_INVALID_OTP',
      })
    }
    const trx = await db.transaction()
    await Category.query({ client: trx }).where('user_id', user.id).delete()
    await Post.query({ client: trx }).where('user_id', user.id).delete()
    await UserToken.query({ client: trx }).where('user_id', user.id).delete()
    await trx.commit()
  }

  /**
   * @todo 회원을 탈퇴시킵니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async withdraw(user: User, dto: WithdrawDto) {
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', {
        status: 400,
        code: 'E_INVALID_OTP',
      })
    }
    await user.delete()
  }
}
