import UserToken from '#models/user_token'
import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import { UserFactory } from './user_factory.js'

export const UserTokenFactory = factory
  .define(UserToken, async ({ faker }) => {
    return {
      refreshToken: faker.string.nanoid(),
      expiryDate: DateTime.fromJSDate(faker.date.future()),
      lastRefreshingDate: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .relation('user', () => UserFactory)
  .build()
