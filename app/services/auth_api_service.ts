import Collection, { CollectionTypes } from '#models/collection'
import { Roles } from '#models/role'
import User from '#models/user'
import UserToken from '#models/user_token'
import { BaseUtil } from '#utils/base_util'
import { JwtUtil } from '#utils/jwt_util'
import { LoginDto, RegisterDto } from '#validators/auth'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export default class AuthApiService {
  /**
   * @todo 로그인 작업을 수행합니다. 성공시 JWT 토큰을 반환합니다.
   * @throws 계정을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @throws 비밀번호가 일치하지 않으면 404 오류를 발생시킵니다.
   * @throws 이메일이 인증되지 않은 경우 400 오류를 발생시킵니다.
   */
  static async login(dto: LoginDto) {
    let errMsg = '아이디 또는 비밀번호를 찾을 수 없습니다.'
    let errCode = 'E_USER_NOT_FOUND'
    let status = 404
    let user = await User.findBy('email', dto.email)

    if (!user) {
      throw new Exception(errMsg, { status, code: errCode })
    }
    if (!(await user.verifyPassword(dto.password))) {
      throw new Exception(errMsg, { status, code: errCode })
    }
    if (!user.isEmailVerified) {
      throw new Exception('인증되지 않은 계정입니다.', {
        status: 400,
        code: 'E_EMAIL_NOT_VERIFIED',
      })
    }

    const tokens = JwtUtil.generateTokens(user.id)
    await UserToken.createOrUpdate(user.id, tokens.refreshToken)
    return tokens
  }

  /**
   * @todo 회원가입 작업을 수행합니다.
   * @throws 이메일이 이미 존재하면 409 오류를 발생시킵니다.
   */
  static async register(dto: RegisterDto) {
    let user = await User.findBy('email', dto.email)
    if (user) {
      throw new Exception('이미 존재하는 이메일입니다.', { status: 409, code: 'E_DUPLICATE_EMAIL' })
    }

    const tx = await db.transaction()

    user = await User.create(
      {
        ...dto,
        roleId: Roles.USER,
        password: dto.password,
        nickname: BaseUtil.generateRandomNickname(),
        otp: null,
        otpExpiryDate: null,
        isEmailVerified: false,
      },
      { client: tx }
    )

    await Collection.createMany(
      [
        {
          userId: user.id,
          categoryId: null,
          type: CollectionTypes.UNCATEGORIZED,
          title: '미분류',
        },
        {
          userId: user.id,
          categoryId: null,
          type: CollectionTypes.TRASH,
          title: '휴지통',
        },
      ],
      { client: tx }
    )

    await tx.commit()
  }

  /**
   * @todo OTP코드를 생성하고 이메일로 전송합니다.
   * @throws 이메일을 찾을 수 없으면 404 오류를 발생시킵니다.
   */
  static async generateOtp(email: string) {
    let user = await User.findBy('email', email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }

    await user
      .merge({
        otp: BaseUtil.generateOTP(),
        otpExpiryDate: DateTime.now().plus({ minutes: 5 }),
      })
      .save()

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('OTP 인증 코드 발송')
        .htmlView('shared/mail/template', { otp: user.otp })
    })
  }

  /**
   * @todo OTP코드를 확인하고 이메일인증 여부를 업데이트 합니다.
   * @throws 이메일을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async verifyOtp(email: string, otp: string) {
    let user = await User.findBy('email', email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }

    if (!user.verifyOtp(otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', {
        status: 400,
        code: 'E_INVALID_OTP',
      })
    }

    await user
      .merge({
        isEmailVerified: true,
        otp: null,
        otpExpiryDate: null,
      })
      .save()

    const tokens = JwtUtil.generateTokens(user.id)
    await UserToken.createOrUpdate(user.id, tokens.refreshToken)
    return tokens
  }

  /**
   * @todo 토큰을 재발급합니다.
   * @throws 토큰이 유효하지 않으면 401 오류를 발생시킵니다.
   * @throws 토큰이 만료되었으면 401 오류를 발생시킵니다.
   */
  static async refresh(refreshToken: string) {
    const userToken = await UserToken.findBy('refreshToken', refreshToken)
    if (!userToken) {
      throw new Exception('토큰이 유효하지 않습니다.', { status: 401, code: 'E_INVALID_TOKEN' })
    }

    if (userToken.expiryDate.diffNow('seconds').seconds < 0) {
      throw new Exception('토큰이 만료되었습니다.', { status: 401, code: 'E_EXPIRED_TOKEN' })
    }

    const tokens = JwtUtil.generateTokens(userToken.userId)

    await userToken
      .merge({
        refreshToken,
        lastRefreshingDate: DateTime.now(),
      })
      .save()

    return tokens
  }

  /**
   * @todo 로그아웃 작업을 수행합니다.
   */
  static async logout({ user }: HttpContext) {
    const userToken = await UserToken.findBy('userId', user.id)
    if (!userToken) return

    await userToken.delete()
  }
}
