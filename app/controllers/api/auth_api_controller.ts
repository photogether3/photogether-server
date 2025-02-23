import UserToken from '#models/user_token'
import AuthApiService from '#services/auth_api_service'
import {
  generateOtpValidator,
  LoginDto,
  loginValidator,
  refreshValidator,
  RegisterDto,
  registerValidator,
  verifyOtpValidator,
} from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthApiController {
  async login({ request }: HttpContext) {
    const dto: LoginDto = await request.validateUsing(loginValidator)
    return await AuthApiService.login(dto)
  }

  async register({ request }: HttpContext) {
    const dto: RegisterDto = await request.validateUsing(registerValidator)
    return await AuthApiService.register(dto)
  }

  async generateOtp({ request }: HttpContext) {
    const payload = await request.validateUsing(generateOtpValidator)
    return await AuthApiService.generateOtp(payload.email)
  }

  async verifyOtp({ request }: HttpContext) {
    const payload = await request.validateUsing(verifyOtpValidator)
    return await AuthApiService.verifyOtp(payload.email, payload.otp)
  }

  async refresh({ request }: HttpContext) {
    let refreshTokenString = request.headers()['x-refresh-token'] as string
    const { refreshToken } = await refreshValidator.validate({ refreshToken: refreshTokenString })
    return await AuthApiService.refresh(refreshToken)
  }

  async logout({ user }: HttpContext) {
    const userToken = await UserToken.findBy('userId', user.id)
    if (!userToken) return
    await userToken.delete()
  }
}
