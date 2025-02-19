import Collection from '#models/collection';
import { PaginationDto } from '#models/dto/pagination.dto';
import Post from '#models/post';
import PostMetadata from '#models/post_metadata';
import { defaultPostIndexDto, PostIndexDto, postIndexValidator, PostStoreDto, postStoreValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class PostApiController {

  async index({ user, request }: HttpContext) {
    const requestData = {
      ...defaultPostIndexDto,
      ...request.all(),
    }
    const dto: PostIndexDto = await postIndexValidator.validate(requestData)

    await Collection.findOrFail(dto.collectionId)

    const result = await Post.query()
      .where('user_id', user.id)
      .where('collection_id', dto.collectionId)
      .orderBy(dto.sortBy, dto.sortOrder)
      .preload('collection', (collection) => {
        collection.preload('category')
      })
      .preload('metadatas')
      .paginate(dto.page, dto.perPage)

    const { meta, data } = result.serialize()
    const items = data.map(x => {
      return {
        id: x.id,
        title: x.title,
        content: x.content,
        imageUrl: x.imageUrl,
        collectionId: x.collection.id,
        collection: {
          id: x.collection.id,
          title: x.collection.title,
        },
        category: x.collection.category ?? null,
        metadataList: x.metadatas.map((y: any) => ({
          content: y.content,
          isPublic: y.isPublic,
        }))
      }
    })
    return new PaginationDto(meta, items).toData()
  }

  async store({ user, request, uploadedFileUrl }: HttpContext) {
    const dto: PostStoreDto = await request.validateUsing(postStoreValidator)

    await Collection.findOrFail(dto.collectionId)

    const trx = await db.transaction()
    const post = await Post.create({
      userId: user.id,
      collectionId: dto.collectionId,
      title: dto.title,
      content: dto.content,
      imageUrl: uploadedFileUrl
    }, { client: trx })

    await PostMetadata.creates(post.id, dto.metadataStringify, trx)

    await trx.commit()
  }

  async update({ }: HttpContext) { }

  async updateWithMove({ }: HttpContext) { }

  async destroys({ }: HttpContext) { }
}