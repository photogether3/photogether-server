import { Roles } from '#models/role'
import User from '#models/user'
import factory from '@adonisjs/lucid/factories'
import { CollectionFactory } from './collection_factory.js'
import { UserTokenFactory } from './user_token_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      roleId: Roles.USER,
      nickname: faker.internet.username(),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      isEmailVerified: true,
      password: faker.internet.password(),
      imageUrl: faker.image.avatar(),
      otp: null
    }
  })
  .relation('token', () => UserTokenFactory)
  .relation('collections', () => CollectionFactory)
  .build()