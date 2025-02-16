import Collection from '#models/collection'
import User from '#models/user'
import { generateOtpValidator, registerValidator } from '#validators/auth'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class AuthApiController {

  async login({ request }: HttpContext) {
    console.log('login')
    console.log(request.body())
    let user = await User.findBy('email', request.body().email)
    if (!user) {
      throw new Exception('아이디 또는 비밀번호를 찾을 수 없습니다.', { status: 404 })
    }

    return 'ok'
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

  async verifyOtp() { }

  async refresh() { }

  async logout() { }
}