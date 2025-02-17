import Collection from '#models/collection'
import User from '#models/user'
import UserToken from '#models/user_token'
import { JwtService } from '#services/jwt_service'
import { generateOtpValidator, LoginDto, loginValidator, registerValidator, verifyOtpValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

@inject()
export default class AuthApiController {

  constructor(
    private readonly jwtService: JwtService
  ) { }

  async login({ request }: HttpContext) {
    const dto: LoginDto = await request.validateUsing(loginValidator)

    let user = await User.findBy('email', dto.email)
    if (!user) {
      throw new Exception('아이디 또는 비밀번호를 찾을 수 없습니다.', { status: 404, code: 'E_USER_NOT_FOUND' })
    }

    const result = await user.verifyPassword(dto.password)
    console.log(result)
    if (!await user.verifyPassword(dto.password)) {
      throw new Exception('아이디 또는 비밀번호를 찾을 수 없습니다.', { status: 404, code: 'E_USER_NOT_FOUND' })
    }

    if (!user.isEmailVerified) {
      throw new Exception('인증되지 않은 계정입니다.', { status: 404, code: 'E_EMAIL_NOT_VERIFIED' })
    }

    const tokens = this.jwtService.generateTokens(user.id)
    console.log(tokens)

    await UserToken.from(user.id, tokens.refreshToken)

    return tokens
  }

  async register({ request }: HttpContext) {
    // 유효성 검사
    const payload = await request.validateUsing(registerValidator)

    // 이미 존재하는 이메일인지 확인
    let user = await User.findBy('email', payload.email)
    if (user) {
      throw new Exception('이미 존재하는 이메일입니다.', { status: 409, code: 'E_DUPLICATE_EMAIL' })
    }

    // 사용자 생성, 사용자 기본 컬렉션 생성
    user = await User.from(payload)
    await Collection.fromBases(user.id)
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
    user = await user.withGenerateOtp()
    console.log(user.serialize())

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
    user = await user.withVerifiedEmail()

    console.log(user.serialize())
  }

  async refresh() { }

  async logout() { }
}