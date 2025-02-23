import Collection, { CollectionTypes } from '#models/collection'
import Post from '#models/post'
import PostMetadata from '#models/post_metadata'
import { PaginationDto } from '#models/vm/pagination.vm'
import { PostVmFactory } from '#models/vm/post.vm'
import {
  DestroyPostDto,
  MovePostsDto,
  PostIndexDto,
  PostStoreDto,
  UpdatePostDto,
} from '#validators/post'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'

export default class PostApiService {
  /**
   * @todo 게시물 목록을 조회합니다.
   */
  static async index(userId: number, dto: PostIndexDto) {
    await Collection.findOrFail(dto.collectionId)

    const result = await Post.query()
      .where('user_id', userId)
      .where('collection_id', dto.collectionId)
      .orderBy(dto.sortBy, dto.sortOrder)
      .preload('collection', (collection) => {
        collection.preload('category')
      })
      .preload('metadatas')
      .paginate(dto.page, dto.perPage)

    const { meta, data } = result.serialize()
    const posts = data as Post[]
    const items = posts.map((x) => new PostVmFactory(x).toDetail())
    return new PaginationDto(meta, items).toData()
  }

  /**
   * @todo 게시물을 조회합니다.
   */
  static async show(userId: number, postId: number) {
    const post = await Post.findByOrFail({
      userId: userId,
      id: postId,
    })
    await post.load('collection', (collection) => {
      collection.preload('category')
    })
    await post.load('metadatas')
    return new PostVmFactory(post).toDetail()
  }

  /**
   * @todo 게시물을 생성합니다.
   * @transaction 게시물, 게시물 메타데이터
   */
  static async store(userId: number, dto: PostStoreDto, uploadedFileUrl: string | null) {
    await Collection.findOrFail(dto.collectionId)

    const trx = await db.transaction()

    const post = await Post.create(
      {
        userId: userId,
        collectionId: dto.collectionId,
        title: dto.title,
        content: dto.content,
        imageUrl: uploadedFileUrl,
      },
      { client: trx }
    )

    await PostMetadata.creates(post.id, dto.metadataList, trx)

    await trx.commit()

    return post
  }

  /**
   * @todo 게시물을 수정합니다.
   * @throws 게시물을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @transaction 게시물, 게시물 메타데이터
   */
  static async update(userId: number, dto: UpdatePostDto) {
    const post = await Post.query().where('id', dto.postId).andWhere('user_id', userId).first()

    if (!post)
      throw new Exception('Post not found', {
        status: 404,
        code: 'E_NOT_FOUND',
      })

    const trx = await db.transaction()

    await post
      .merge({
        title: dto.title,
        content: dto.content,
      })
      .useTransaction(trx)
      .save()

    await PostMetadata.creates(post.id, dto.metadataList, trx)

    await trx.commit()
  }

  /**
   * @todo 게시물그룹을 다른 카테고리로 이동합니다.
   */
  static async updateWithMove(userId: number, dto: MovePostsDto) {
    await Collection.findByOrFail({
      id: dto.collectionId,
      userId: userId,
    })

    await Post.query().where('user_id', userId).andWhereIn('id', dto.postIds).update({
      collectionId: dto.collectionId,
    })
  }

  /**
   * @todo 게시물그룹을 삭제합니다.
   */
  static async destroys(userId: number, dto: DestroyPostDto) {
    const collection = await Collection.findByOrFail({
      userId: userId,
      type: CollectionTypes.TRASH,
    })

    await Post.query().where('user_id', userId).andWhereIn('id', dto.postIds).update({
      collectionId: collection.id,
    })
  }
}
