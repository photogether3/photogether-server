import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class UserToken extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare refreshToken: string

  @column.dateTime()
  declare expiryDate: DateTime

  @column.dateTime()
  declare lastRefreshingDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async from(userId: number, refreshToken: string) {
    return await this.create({
      userId,
      refreshToken,
      expiryDate: DateTime.now().plus({ days: 7 }),
      lastRefreshingDate: DateTime.now(),
    })
  }
}