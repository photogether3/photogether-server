import { UserFactory } from '#database/factories/user_factory';
import Category from '#models/category';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    const users = await UserFactory.with('token').createMany(5)
    const categories = await Category.all()

    for (const user of users) {
      const randomCategoryIds = categories
        .sort(() => 0.5 - Math.random()) // 배열을 랜덤으로 섞음
        .slice(0, Math.floor(Math.random() * 3) + 1) // 1~3개 선택
        .map(category => category.id)
      await user.related('favoriteCategories').attach(randomCategoryIds)
    }
  }
}