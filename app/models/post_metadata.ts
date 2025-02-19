import { Exception } from '@adonisjs/core/exceptions'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Post from './post.js'

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

  static async creates(postId: number, metadataStringify: string, trx: TransactionClientContract) {
    let metadatas: { content: string, isPublic: boolean, postId: number }[] = []
    try {
      metadatas = JSON.parse(metadataStringify)
      metadatas = metadatas.map(x => ({ ...x, postId }))
    } catch (err) {
      throw new Exception('Invalid metadata stringify', { code: 'E_INVALID_METADATA_STRINGIFY', status: 400 })
    }
    await PostMetadata.createMany(metadatas, { client: trx })
    return this
  }
}