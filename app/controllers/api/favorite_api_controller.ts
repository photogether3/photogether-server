import { StoreFavoriteDto, storeFavoriteValidator } from "#validators/favorite";
import { HttpContext } from "@adonisjs/core/http";

export default class FavoriteApiController {

  async index({ user }: HttpContext) { 
    return await user.related('favoriteCategories').query()
  }

  async storeOrUpdate({ user, request }: HttpContext) {
    const dto: StoreFavoriteDto = await request.validateUsing(storeFavoriteValidator)
    await user.related('favoriteCategories').sync(dto.categoryIds)
  }
}