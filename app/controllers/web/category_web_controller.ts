import { HttpContext } from '@adonisjs/core/http'

export default class CategoryWebController {
  async index({ view }: HttpContext) {
    return view.render('pages/categories/index')
  }
}
