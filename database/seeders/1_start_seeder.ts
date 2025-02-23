import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // const users = await UserFactory
    //   .with('token')
    //   .with('collections', 1, (builder) => builder.merge({
    //     categoryId: null,
    //     title: '미분류',
    //     type: CollectionTypes.UNCATEGORIZED
    //   }))
    //   .with('collections', 1, (builder) => builder.merge({
    //     categoryId: null,
    //     title: '휴지통',
    //     type: CollectionTypes.TRASH
    //   }))
    //   .with('collections', 3)
    //   .createMany(5)
    // const categories = await Category.all()
    // for (const user of users) {
    //   const randomCategoryIds = categories
    //     .sort(() => 0.5 - Math.random()) // 배열을 랜덤으로 섞음
    //     .slice(0, Math.floor(Math.random() * 3) + 1) // 1~3개 선택
    //     .map(category => category.id)
    //   await user.related('favoriteCategories').attach(randomCategoryIds)
    // }
    // const userCollections = await users[0].related('collections').query()
    // let index = 1
    // for (const collection of userCollections) {
    //   console.log(collection.id)
    //   await PostFactory.merge({
    //     userId:  users[0].id,
    //     collectionId: collection.id
    //   }).with('metadatas', 3).createMany(5)
    //   index++
    // }
  }
}
