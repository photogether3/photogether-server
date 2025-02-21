import Category from '#models/category';
import Collection, { CollectionTypes } from '#models/collection';
import Post from '#models/post';
import { CollectionVmFactory } from '#models/vm/collection.vm';
import { defaultIndexCollectionDto, IndexCollectionDto, indexCollectionValidator, ShowCollectionDto, showCollectionValidator, StoreCollectionDto, storeCollectionValidator, UpdateCollectionDto, updateCollectionValidator } from '#validators/collection';
import { Exception } from '@adonisjs/core/exceptions';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

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
      .withCount('posts')
      .preload('posts', (query) => {
        query.orderBy('id', 'desc').limit(3)
      })
      .paginate(page, perPage)

    return CollectionVmFactory.makeWithPaginatedData(collections)
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
      .withCount('posts')
      .preload('posts', (query) => {
        query.orderBy('id', 'desc').limit(3)
      })
      .firstOrFail()

    return CollectionVmFactory.make(collection)
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

  async destroy({ user, request }: HttpContext) {
    const dto: ShowCollectionDto = await showCollectionValidator.validate({
      collectionId: request.param('collectionId')
    })

    const collections = await Collection
      .query()
      .apply(scope => scope.my(user.id))

    const willRemove = collections.find(x => x.id === dto.collectionId)
    if (!willRemove) {
      throw new Exception('Collection not found', {
        code: 'E_NOT_FOUND_COLLECTION',
        status: 404
      })
    }

    if (willRemove.type !== CollectionTypes.DEFAULT) {
      throw new Exception('Cannot delete this collection', {
        code: 'E_CANNOT_DELETE_COLLECTION',
        status: 400
      })
    }

    const trash = collections.find(x => x.type === CollectionTypes.TRASH)
    if (!trash) {
      throw new Exception('Trash collection not found', {
        code: 'E_SOMETHING_WORNG',
        status: 500
      })
    }

    const trx = await db.transaction()

    await Post.query({ client: trx })
      .where('collectionId', willRemove.id)
      .update({
        collectionId: trash.id
      })

    await willRemove
      .useTransaction(trx)
      .delete()

    trx.commit()
  }
}