import Category from '#models/category';
import { CategoryDto } from '#models/dto/category.dto';
import type { HttpContext } from '@adonisjs/core/http';

export default class CategoryApiController {

  async index({ }: HttpContext) {
    return await Category.query().orderBy('id', 'asc')
  }

  async indexWithFavorite({ user }: HttpContext) {
    const results = await Category.query().preload('favoriteUsers')
    return results.map(x => new CategoryDto(x).toWithFavorite(user.id))
  }

  async store({ }: HttpContext) { }

  async destroy({ }: HttpContext) { }

}