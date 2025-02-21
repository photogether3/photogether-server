import { LoginDto } from '#validators/auth'
import { UpdatePasswordDto } from '#validators/user'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Exception } from '@adonisjs/core/exceptions'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'
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
    pivotTimestamps: true
  })
  declare favoriteCategories: ManyToMany<typeof Category>

  /**
   |------------------------------------------------------------
   |Static Methods 🎁
   |------------------------------------------------------------
   */

  /**
   * @todo 로그인 작업을 수행합니다.
   * @throws 계정을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @throws 비밀번호가 일치하지 않으면 404 오류를 발생시킵니다.
   * @throws 이메일이 인증되지 않은 경우 400 오류를 발생시킵니다.
   */
  static async login(dto: LoginDto) {
    let errMsg = '아이디 또는 비밀번호를 찾을 수 없습니다.'
    let errCode = 'E_USER_NOT_FOUND'
    let status = 404
    let user = await User.findBy('email', dto.email)

    if (!user) {
      throw new Exception(errMsg, { status, code: errCode })
    }
    if (!await user.verifyPassword(dto.password)) {
      throw new Exception(errMsg, { status, code: errCode })
    }
    if (!user.isEmailVerified) {
      throw new Exception('인증되지 않은 계정입니다.', { status: 400, code: 'E_EMAIL_NOT_VERIFIED' })
    }

    return user
  }

  /**
   * @todo 비밀번호를 변경합니다.
   * @throws 계정을 찾을 수 없으면 404 오류를 발생시킵니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  static async updatePasswordByOtp(dto: { email: string; otp: string; password: string }) {
    let user = await User.findBy('email', dto.email)
    if (!user) {
      throw new Exception('이메일을 찾을 수 없습니다.', { status: 404, code: 'E_EMAIL_NOT_FOUND' })
    }
    if (!user.verifyOtp(dto.otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }

    await user.merge({ password: dto.password }).save()
  }

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

  /**
   * @todo 비밀번호를 변경합니다.
   * @throws 비밀번호가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  async updatePassword(dto: UpdatePasswordDto) {
    if (!await this.verifyPassword(dto.currentPassword)) {
      throw new Exception('기존 비밀번호와 일치하지 않습니다', { status: 400, code: 'E_INVALID_PASSWORD' })
    }
    await this.merge({ password: dto.newPassword }).save()
  }

  /**
   * @todo 회원의 모든 데이터를 초기화합니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  async resetData(otp: string) {
    if (!this.verifyOtp(otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', { status: 400, code: 'E_INVALID_OTP' })
    }
    const trx = await db.transaction()
    await Category.query({ client: trx }).where('user_id', this.id).delete()
    await Post.query({ client: trx }).where('user_id', this.id).delete()
    await UserToken.query({ client: trx }).where('user_id', this.id).delete()
    await trx.commit()
  }

  /**
   * @todo 회원을 탈퇴시킵니다.
   * @throws OTP 인증 코드가 일치하지 않으면 400 오류를 발생시킵니다.
   */
  async withdraw(otp: string) {
    if (!this.verifyOtp(otp)) {
      throw new Exception('OTP 인증 코드가 일치하지 않습니다.', {
        status: 400,
        code: 'E_INVALID_OTP'
      })
    }
    await this.delete()
  }
}