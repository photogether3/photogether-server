import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Role, { Roles } from './role.js'
import UserToken from './user_token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: Roles

  @column()
  declare fileGroupId: number | null

  @column()
  declare nickname: string

  @column()
  declare bio: string | null

  @column()
  declare email: string

  @column()
  declare isEmailVerified: boolean

  @column()
  declare password: string

  @column()
  declare otp: string | null

  @column.dateTime()
  declare otpExpiryDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasOne(() => UserToken)
  declare token: HasOne<typeof UserToken>
}