import CollectionApiService from '#services/collection_api_service';
import { defaultIndexCollectionDto, IndexCollectionDto, indexCollectionValidator, ShowCollectionDto, showCollectionValidator, StoreCollectionDto, storeCollectionValidator, UpdateCollectionDto, updateCollectionValidator } from '#validators/collection';
import type { HttpContext } from '@adonisjs/core/http';

export default class CollectionApiController {

  async index({ user, request }: HttpContext) {
    const dto: IndexCollectionDto = await indexCollectionValidator.validate({
      ...defaultIndexCollectionDto,
      ...request.all()
    })
    return await CollectionApiService.index(user.id, dto)
  }

  async show({ user, request }: HttpContext) {
    const dto: ShowCollectionDto = await showCollectionValidator.validate({
      collectionId: request.param('collectionId')
    })
    return await CollectionApiService.show(user.id, dto.collectionId)
  }

  async store({ user, request }: HttpContext) {
    const dto: StoreCollectionDto = await request.validateUsing(storeCollectionValidator)
    return await CollectionApiService.store(user.id, dto)
  }

  async update({ user, request }: HttpContext) {
    const dto: UpdateCollectionDto = await updateCollectionValidator.validate({
      collectionId: request.param('collectionId'),
      categoryId: request.body().categoryId,
      title: request.body().title,
    })
    return await CollectionApiService.update(user.id, dto)
  }

  async destroy({ user, request }: HttpContext) {
    const dto: ShowCollectionDto = await showCollectionValidator.validate({
      collectionId: request.param('collectionId')
    })
    return await CollectionApiService.destroy(user.id, dto.collectionId)
  }
}