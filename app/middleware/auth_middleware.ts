import User from '#models/user'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx.request.headers())

    const headers = ctx.request.headers()

    const authorization = headers.authorization
    if (!authorization) {
      return ctx.response.status(401).json({
        errorCode: 401,
        code: 'UNAUTHORIZED_001',
        message: '토큰이 유효하지 않습니다.'
      })
    }

    const token = authorization.split('Bearer ')[1]
    if (!token) {
      return ctx.response.status(401).json({
        errorCode: 401,
        code: 'UNAUTHORIZED_002',
        message: '토큰이 유효하지 않습니다.'
      })
    }

    try {
      const payload = jwt.verify(token, env.get('APP_KEY')) as jwt.JwtPayload
      // (ctx.request as any)['user'] = payload
      // ctx.request.
      const user = await User.findByOrFail('id', Number(payload.sub))
      console.log(user.serialize())
      
    } catch (err) {
      return ctx.response.status(401).json({
        errorCode: 401,
        code: 'UNAUTHORIZED_003',
        message: '토큰이 유효하지 않습니다.'
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}