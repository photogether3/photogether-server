import env from '#start/env'
import { HttpContext } from '@adonisjs/http-server'
import jwt from 'jsonwebtoken'

export default class JwtGuard {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    // Authorization 헤더 확인
    const authHeader = request.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Unauthorized: 토큰이 없습니다.' })
    }

    // Bearer 토큰 추출
    const token = authHeader.split(' ')[1]

    try {
      // 토큰 검증 (Env 파일에 APP_KEY 또는 별도의 JWT 비밀키를 지정)
      const decoded = jwt.verify(token, env.get('APP_KEY'))
      // 필요 시, decoded 데이터를 request에 저장하거나, auth 객체에 할당할 수 있음.
      console.log(decoded)
      await next()
    } catch (error) {
      return response.status(401).json({ error: 'Unauthorized: 유효하지 않은 토큰입니다.' })
    }
  }
}