import Post from '#models/post'
import factory from '@adonisjs/lucid/factories'
import { PostMetadataFactory } from './post_metadata_factory.js'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      title: faker.lorem.words(10),
      content: faker.lorem.paragraph(),
      posterUrl: faker.image.url()
    }
  })
  .relation('metadatas', () => PostMetadataFactory)
  .build()