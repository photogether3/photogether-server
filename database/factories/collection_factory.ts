import Collection, { CollectionTypes } from '#models/collection'
import factory from '@adonisjs/lucid/factories'

export const CollectionFactory = factory
  .define(Collection, async ({ faker }) => {
    return {
      title: faker.lorem.slug(),
      type: CollectionTypes.DEFAULT
    }
  })
  .build()