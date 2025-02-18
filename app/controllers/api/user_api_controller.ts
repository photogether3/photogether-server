import { UserDto } from '#models/dto/user.dto'
import User from '#models/user'
import { emailTakenValidator } from '#validators/user'
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

  async updatePasswordByOtp({ request }: HttpContext) { }

  async updatePassword({ request }: HttpContext) { }

  async reset({ request }: HttpContext) { }

  async withdraw({ request }: HttpContext) { }
}