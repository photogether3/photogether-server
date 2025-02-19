import Category from '#models/category';
import Collection from '#models/collection';
import { PaginationDto } from '#models/dto/pagination.dto';
import { defaultIndexCollectionDto, IndexCollectionDto, indexCollectionValidator, ShowCollectionDto, showCollectionValidator, StoreCollectionDto, storeCollectionValidator, UpdateCollectionDto, updateCollectionValidator } from '#validators/collection';
import { Exception } from '@adonisjs/core/exceptions';
import type { HttpContext } from '@adonisjs/core/http';

export default class CollectionApiController {

  async index({ user, request }: HttpContext) {
    const { page, perPage, sortBy, sortOrder }: IndexCollectionDto = await indexCollectionValidator.validate({
      ...defaultIndexCollectionDto,
      ...request.all()
    })

    const collections = await Collection
      .query()
      .apply(scope => scope.my(user.id))
      .orderBy(sortBy, sortOrder)
      .preload('category')
      .paginate(page, perPage)
    const { meta, data } = collections.serialize()

    return new PaginationDto(meta, data).toData()
  }

  async show({ user, request }: HttpContext) {
    const dto: ShowCollectionDto = await showCollectionValidator.validate({
      collectionId: request.param('collectionId')
    })

    const collection = await Collection
      .query()
      .apply(scope => scope.my(user.id))
      .apply(scope => scope.one(dto.collectionId))
      .preload('category')
      .first()

    if (!collection) {
      throw new Exception('Collection not found', { code: 'E_NOT_FOUND_COLLECTION', status: 404 })
    }

    return collection
  }

  async store({ user, request }: HttpContext) {
    const dto: StoreCollectionDto = await request.validateUsing(storeCollectionValidator)

    await Collection.create({
      userId: user.id,
      categoryId: dto.categoryId,
      title: dto.title,
    })
  }

  async update({ user, request }: HttpContext) {
    const dto: UpdateCollectionDto = await updateCollectionValidator.validate({
      collectionId: request.param('collectionId'),
      categoryId: request.body().categoryId,
      title: request.body().title,
    })

    const category = await Category.find(dto.categoryId)
    if (!category) {
      throw new Exception('Category not found', { code: 'E_NOT_FOUND_CATEGORY', status: 404 })
    }

    const collection = await Collection
      .query()
      .apply(scope => scope.my(user.id))
      .apply(scope => scope.one(dto.collectionId))
      .preload('category')
      .first()

    if (!collection) {
      throw new Exception('Collection not found', { code: 'E_NOT_FOUND_COLLECTION', status: 404 })
    }

    await collection.merge({
      categoryId: dto.categoryId,
      title: dto.title,
    }).save()
  }
}