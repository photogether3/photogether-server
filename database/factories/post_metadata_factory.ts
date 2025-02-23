import PostMetadata from '#models/post_metadata'
import factory from '@adonisjs/lucid/factories'

export const PostMetadataFactory = factory
  .define(PostMetadata, async ({ faker }) => {
    return {
      rank: 1,
      content: faker.lorem.paragraph(),
      isPublic: faker.datatype.boolean(),
    }
  })
  .build()
