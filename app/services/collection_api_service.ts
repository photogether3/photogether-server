import Category from '#models/category';
import Collection, { CollectionTypes } from '#models/collection';
import Post from '#models/post';
import { CollectionVmFactory } from '#models/vm/collection.vm';
import { IndexCollectionDto, StoreCollectionDto, UpdateCollectionDto } from '#validators/collection';
import { Exception } from '@adonisjs/core/exceptions';
import db from '@adonisjs/lucid/services/db';

export default class CollectionApiService {

  /**
   * @todo 사진첩 목록을 조회합니다.
   */
  static async index(userId: number, dto: IndexCollectionDto) {
    const { page, perPage, sortBy, sortOrder } = dto

    const collections = await Collection
      .query()
      .apply(scope => scope.my(userId))
      .orderBy(sortBy, sortOrder)
      .preload('category')
      .withCount('posts')
      .preload('posts', (query) => {
        query.orderBy('id', 'desc').limit(3)
      })
      .paginate(page, perPage)

    return CollectionVmFactory.makeWithPaginatedData(collections)
  }

  /**
   * @todo 사진첩을 조회합니다.
   */
  static async show(userId: number, collectionId: number) {
    const collection = await Collection
      .query()
      .apply(scope => scope.my(userId))
      .apply(scope => scope.one(collectionId))
      .preload('category')
      .withCount('posts')
      .preload('posts', (query) => {
        query.orderBy('id', 'desc').limit(3)
      })
      .firstOrFail()

    return CollectionVmFactory.make(collection)
  }

  /**
   * @todo 사진첩을 생성합니다.
   */
  static async store(userId: number, dto: StoreCollectionDto) {
    await Collection.create({
      userId,
      categoryId: dto.categoryId,
      title: dto.title,
    })
  }

  /**
   * @todo 사진첩을 수정합니다.
   * @throws 카테고리가 존재하지 않을 경우 404 예외를 발생시킵니다.
   * @throws 사진첩이 존재하지 않을 경우 404 예외를 발생시킵니다.
   */
  static async update(userId: number, dto: UpdateCollectionDto) {
    const category = await Category.find(dto.categoryId)
    if (!category) {
      throw new Exception('Category not found', { code: 'E_NOT_FOUND_CATEGORY', status: 404 })
    }

    const collection = await Collection
      .query()
      .apply(scope => scope.my(userId))
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

  /**
   * @todo 사진첩을 삭제합니다.
   * @throws 사진첩이 존재하지 않을 경우 404 예외를 발생시킵니다.
   * @throws 기본 사진첩을 삭제하려고 할 경우 400 예외를 발생시킵니다.
   * @throws 사용자의 휴지통이 없을 경우 500 예외를 발생시킵니다.
   */
  static async destroy(userId: number, collectionId: number) {
    const collections = await Collection
      .query()
      .apply(scope => scope.my(userId))

    const willRemove = collections.find(x => x.id === collectionId)
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