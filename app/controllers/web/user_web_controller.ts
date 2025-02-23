import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UserWebController {
  async index({ view }: HttpContext) {
    const paginatedUser = await User.query()
      .preload('role')
      .orderBy('created_at', 'desc')
      .paginate(1, 10)

    const { meta, data } = paginatedUser.serialize()
    return view.render('pages/users/index', { meta, data })
  }
}
