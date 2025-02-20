import { BaseModel, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Category from './category.js'
import Post from './post.js'
import User from './user.js'

export enum CollectionTypes {
  DEFAULT = 'DEFAULT',
  UNCATEGORIZED = 'UNCATEGORIZED',
  TRASH = 'TRASH'
}

export default class Collection extends BaseModel {

  public static serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare categoryId: number | null

  @column()
  declare type: CollectionTypes

  @column()
  declare title: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  public static my = scope((query, userId: number) => {
    query.where('user_id', userId)
  })

  public static one = scope((query, collectionId: number) => {
    query.where('id', collectionId)
  })
}