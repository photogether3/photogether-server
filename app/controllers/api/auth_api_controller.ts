import Collection, { CollectionTypes } from '#models/collection'
import { Roles } from '#models/role'
import User from '#models/user'
import UserToken from '#models/user_token'
import { JwtService } from '#services/jwt_service'
import { UtilService } from '#services/util_service'
import { generateOtpValidator, LoginDto, loginValidator, refreshValidator, RegisterDto, registerValidator, verifyOtpValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

@inject()
export default class AuthApiController {

  constructor(
    private readonly jwtService: JwtService
  ) { }

  async login({ request }: HttpContext) {
    const dto: LoginDto = await request.validateUsing(loginValidator)

    // 아이디 확인
    let user = await User.findBy('email', dto.email)
    if (!user) {
      throw new Exception('아이디 또는 비밀번호를 찾을 수 없습니다.', { status: 404, code: 'E_USER_NOT_FOUND' })
    }

    // 비밀번호 확인
    if (!await user.verifyPassword(dto.password)) {
      throw new Exception('아이디 또는 비밀번호를 찾을 수 없습니다.', { status: 404, code: 'E_USER_NOT_FOUND' })
    }

    // 이메일 인증 여부 확인
    if (!user.isEmailVerified) {
      throw new Exception('인증되지 않은 계정입니다.', { status: 404, code: 'E_EMAIL_NOT_VERIFIED' })
    }

    // 토큰 생성
    const tokens = this.jwtService.generateTokens(user.id)
    await UserToken.createOrUpdate(user.id, tokens.refreshToken)
    return tokens
  }

  async register({ request }: HttpContext) {
    // 유효성 검사
    const dto: RegisterDto = await request.validateUsing(registerValidator)

    // 이미 존재하는 이메일인지 확인
    let user = await User.findBy('email', dto.email)
    if (user) {
      throw new Exception('이미 존재하는 이메일입니다.', { status: 409, code: 'E_DUPLICATE_EMAIL' })
    }

    // 사용자 생성, 사용자 기본 컬렉션 생성
    const tx = await db.transaction()

    user = await User.create({
      ...dto,
      roleId: Roles.USER,
      password: dto.password,
      nickname: UtilService.generateRandomNickname(),
      otp: null,
      otpExpiryDate: null,
      isEmailVerified: false,
    }, { client: tx })

    await Collection.createMany([
      {
        userId: user.id,
        categoryId: null,
        type: CollectionTypes.UNCATEGORIZED,
        title: '미분류'
      },
      {
        userId: user.id,
        categoryId: null,
        type: CollectionTypes.TRASH,
        title: '휴지통'
      }
    ], { client: tx })

    await tx.commit()
  }

  async generateOtp({ request }: HttpContext) {
    // 유효성 검사
    const payload = await request.validateUsing(generateOtpValidator)

    // 이미 존재하는 이메일인지 확인
    let user = await User.findBy('email', payload.email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }

    // OTP 생성 및 저장
    await user.merge({
      otp: UtilService.generateOTP(),
      otpExpiryDate: DateTime.now().plus({ minutes: 5 })
    }).save()

    // 이메일 전송
    await mail.send((message) => {
      message
        .to(user.email)
        .subject('OTP 인증 코드 발송')
        .htmlView('shared/mail/template', { otp: user.otp })
    })
  }

  async verifyOtp({ request }: HttpContext) {
    // 유효성 검사
    request
    const payload = await request.validateUsing(verifyOtpValidator)

    // 이미 존재하는 이메일인지 확인
    let user = await User.findBy('email', payload.email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }

    // OTP 인증 코드 확인
    if (!user.verifyOtp(payload.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }

    // 이메일 인증 완료
    await user.merge({
      isEmailVerified: true,
      otp: null,
      otpExpiryDate: null,
    }).save()

    // 토큰 발급
    const tokens = this.jwtService.generateTokens(user.id)
    await UserToken.createOrUpdate(user.id, tokens.refreshToken)
    return tokens
  }

  async refresh({ request }: HttpContext) {
    // 유효성 검사
    let refreshTokenString = request.headers()['x-refresh-token'] as string
    const { refreshToken } = await refreshValidator.validate({ refreshToken: refreshTokenString })

    //  토큰 확인
    const userToken = await UserToken.findBy('refreshToken', refreshToken)
    if (!userToken) {
      throw new Exception('토큰이 유효하지 않습니다.', { status: 401, code: 'E_INVALID_TOKEN' })
    }

    //  토큰 만료 확인
    if (userToken.expiryDate.diffNow('seconds').seconds < 0) {
      throw new Exception('토큰이 만료되었습니다.', { status: 401, code: 'E_EXPIRED_TOKEN' })
    }

    // 토큰 발급
    const tokens = this.jwtService.generateTokens(userToken.userId)
    
    await userToken.merge({
      refreshToken,
      lastRefreshingDate: DateTime.now(),
    }).save()

    return tokens
  }

  async logout({ user }: HttpContext) {
    // 토큰 조회
    const userToken = await UserToken.findBy('userId', user.id)
    if (!userToken) return

    // 토큰 삭제
    await userToken.delete()
  }
}