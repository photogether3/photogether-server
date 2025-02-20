import Collection from '#models/collection';
import { PaginationDto } from '#models/vm/pagination.vm';
import { PostVmFactory } from '#models/vm/post.vm';
import Post from '#models/post';
import PostMetadata from '#models/post_metadata';
import { defaultPostIndexDto, parsePostMetadata, PostIndexDto, postIndexValidator, PostStoreDto, postStoreValidator, UpdatePostDto, updatePostValidator } from '#validators/post';
import { Exception } from '@adonisjs/core/exceptions';
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
    const posts = data as Post[]
    const items = posts.map(x => new PostVmFactory(x).toDetail())
    return new PaginationDto(meta, items).toData()
  }

  async show({ user, request }: HttpContext) {
    const post = await Post.findByOrFail({
      userId: user.id,
      id: request.param('postId'),
    })
    await post.load('collection', (collection) => {
      collection.preload('category')
    })
    await post.load('metadatas')
    return new PostVmFactory(post).toDetail()
  }

  async store({ user, request, uploadedFileUrl }: HttpContext) {
    const metadataList = parsePostMetadata(request.body()?.metadataStringify)
    const dto: PostStoreDto = await postStoreValidator.validate({
      ...request.all(),
      metadataList
    })

    await Collection.findOrFail(dto.collectionId)

    const trx = await db.transaction()
    const post = await Post.create({
      userId: user.id,
      collectionId: dto.collectionId,
      title: dto.title,
      content: dto.content,
      imageUrl: uploadedFileUrl
    }, { client: trx })

    await PostMetadata
      .creates(post.id, dto.metadataList, trx)

    await trx.commit()

    return post
  }

  async update({ user, request }: HttpContext) {
    const dto: UpdatePostDto = await updatePostValidator.validate(request.all())

    const post = await Post.query()
      .where('id', dto.postId)
      .andWhere('user_id', user.id)
      .first()

    if (!post) throw new Exception('Post not found', {
      status: 404,
      code: 'E_NOT_FOUND',
    })

    const trx = await db.transaction()

    await post.merge({
      title: dto.title,
      content: dto.content,
    })
      .useTransaction(trx)
      .save()

    await PostMetadata
      .creates(post.id, dto.metadataList, trx)

    await trx.commit()
  }

  async updateWithMove({ }: HttpContext) { }

  async destroys({ }: HttpContext) { }
}