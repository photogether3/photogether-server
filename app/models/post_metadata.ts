import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Post from './post.js'

export type UpdateOrCreatePostMetadataDto = {
  content: string
  isPublic: boolean
}

export default class PostMetadata extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare rank: number

  @column()
  declare content: string

  @column()
  declare isPublic: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  static async creates(
    postId: number,
    metadatas: UpdateOrCreatePostMetadataDto[],
    trx: TransactionClientContract
  ) {
    const postMetadatas = await PostMetadata.query().where('post_id', postId)

    if (postMetadatas.length > 0) {
      await PostMetadata.query().where('post_id', postId).delete()
    }

    const createMetadata = metadatas.map((x) => ({ ...x, postId }))

    await PostMetadata.createMany(createMetadata, { client: trx })
  }
}
