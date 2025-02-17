import env from '#start/env'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

export type JwtResult = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export class JwtService {

  generateTokens(userId: number) {
    const accessToken = jwt.sign({}, env.get('APP_KEY'), {
      subject: userId.toString(),
      expiresIn: '1d',
    })
    const { exp } = jwt.decode(accessToken) as jwt.JwtPayload
    const refreshToken = randomUUID()

    return {
      accessToken,
      refreshToken,
      expiresIn: exp,
    } as JwtResult
  }
}