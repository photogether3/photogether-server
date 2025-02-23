import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Category from './category.js'
import Collection from './collection.js'
import Post from './post.js'
import Role, { Roles } from './role.js'
import UserToken from './user_token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  /**
   |------------------------------------------------------------
   |Properties ✨
   |------------------------------------------------------------
   */

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: Roles

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

  @column()
  declare imageUrl: string | null

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

  @hasMany(() => Collection)
  declare collections: HasMany<typeof Collection>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @manyToMany(() => Category, {
    pivotTable: 'favorites',
    pivotTimestamps: true,
  })
  declare favoriteCategories: ManyToMany<typeof Category>

  /**
   |------------------------------------------------------------
   |Instance Methods 🎁
   |------------------------------------------------------------
   */

  /**
   * @todo OTP 인증번호를 확인합니다.
   */
  verifyOtp(otp: string) {
    return this.otp !== otp ? false : true
  }
}
