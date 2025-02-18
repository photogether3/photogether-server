import { firebaseBucket, firebaseStorage } from '#config/firebase'
import { UserDto } from '#models/dto/user.dto'
import User from '#models/user'
import { emailTakenValidator } from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

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

  async updateProfile({ user, request }: HttpContext) {
    const file = request.file('file')
    if (!file) {
      throw new Exception('파일을 찾을 수 없습니다.', { status: 404, code: 'E_FILE_NOT_FOUND' })
    }
    request.multipart.onFile('file', {}, async (part) => {
      const bucket = firebaseStorage.bucket(firebaseBucket)

      console.log('버킷!!')

      const firebaseFile = bucket.file(part.filename)
      console.log('vkdldjqpdltm 파일!!')
      await firebaseFile.save(part)
      console.log('세이브 됨')
      await firebaseFile.makePublic()
    })
  }

  async updatePasswordByOtp({ request }: HttpContext) { }

  async updatePassword({ request }: HttpContext) { }

  async reset({ request }: HttpContext) { }

  async withdraw({ request }: HttpContext) { }
}