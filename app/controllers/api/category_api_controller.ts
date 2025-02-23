import Category from '#models/category'
import { CategoryVmFactory } from '#models/vm/category.vm'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoryApiController {
  async index({}: HttpContext) {
    return await Category.query().orderBy('id', 'asc')
  }

  async indexWithFavorite({ user }: HttpContext) {
    const results = await Category.query().preload('favoriteUsers')
    return results.map((x) => new CategoryVmFactory(x).toWithFavorite(user.id))
  }

  /** @deprecated */
  async store({}: HttpContext) {}

  /** @deprecated */
  async destroy({}: HttpContext) {}
}
