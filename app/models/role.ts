import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export enum Roles {
  USER = 1,
  ADMIN = 2,
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: Roles

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
