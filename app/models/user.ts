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
  declare avatarUrl: string | null

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

  static async from(payload: { email: string; password: string }) {
    return await this.create({
      ...payload,
      roleId: Roles.USER,
      password: await hash.make(payload.password),
      nickname: this.generateRandomNickname(),
      otp: null,
      otpExpiryDate: null,
      isEmailVerified: false,
    })
  }

  async withGenerateOtp() {
    return await User.updateOrCreate({ id: this.id }, {
      otp: User.generateOTP(),
      otpExpiryDate: DateTime.now().plus({ minutes: 5 }),
    })
  }

  private static generateRandomNickname(): string {
    const prefixes = [
      "멋진", "든든한", "귀여운", "강력한", "재빠른", "화려한", "용감한", "현명한", "활기찬", "유쾌한",
    ];
    const suffixes = [
      "고래밥", "사자", "호랑이", "독수리", "고양이", "강아지", "여우", "팬더", "토끼", "공룡",
    ];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${randomPrefix} ${randomSuffix}`;
  }

  private static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}