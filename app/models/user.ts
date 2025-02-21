import { LoginDto } from '#validators/auth'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Exception } from '@adonisjs/core/exceptions'
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
   * ------------------------------------------------------------
   * Properties ✨
   * ------------------------------------------------------------
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
    pivotTimestamps: true
  })
  declare favoriteCategories: ManyToMany<typeof Category>

  /**
   * ------------------------------------------------------------
   * Methods 🎁
   * ------------------------------------------------------------
   */

  verifyOtp(otp: string) {
    console.log(this.otp, otp)
    return this.otp !== otp ? false : true
  }

  static async login(dto: LoginDto) {
    let errMsg = '아이디 또는 비밀번호를 찾을 수 없습니다.'
    let errCode = 'E_USER_NOT_FOUND'
    let status = 404
    let user = await User.findBy('email', dto.email)

    if (!user) {
      throw new Exception(errMsg, { status, code: errCode })
    }

    // 비밀번호 확인
    if (!await user.verifyPassword(dto.password)) {
      throw new Exception(errMsg, { status, code: errCode })
    }

    // 이메일 인증 여부 확인
    if (!user.isEmailVerified) {
      throw new Exception('인증되지 않은 계정입니다.', { status, code: 'E_EMAIL_NOT_VERIFIED' })
    }

    return user
  }
}