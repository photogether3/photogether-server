import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'test01@gmail.com')
    await user
      .merge({
        password: '1q2w3e4r5t!@',
      })
      .save()
    // const user = await User.create({
    //   email: 'test01@gmail.com',
    //   nickname: '테스터01',
    //   bio: '테스트 계정',
    //   password: '123123',
    //   roleId: Roles.USER,
    //   isEmailVerified: true,
    // })
    // console.log('사용자 생성')

    // const collections = await Collection.createMany([
    //   {
    //     userId: user.id,
    //     categoryId: null,
    //     type: CollectionTypes.UNCATEGORIZED,
    //     title: '미분류'
    //   },
    //   {
    //     userId: user.id,
    //     categoryId: null,
    //     type: CollectionTypes.TRASH,
    //     title: '휴지통'
    //   },
    //   {
    //     userId: user.id,
    //     categoryId: 1002,
    //     type: CollectionTypes.DEFAULT,
    //     title: '건강 챙기기기'
    //   },
    //   {
    //     userId: user.id,
    //     categoryId: 1003,
    //     type: CollectionTypes.DEFAULT,
    //     title: '여행을 가보자'
    //   }
    // ])
    // console.log('컬렉션 생성')

    // collections.filter(c => c.type === CollectionTypes.DEFAULT)

    // await PostFactory.with('metadatas', 2).merge({
    //   userId: 1,
    //   collectionId: 3,
    // }).createMany(20)
    // console.log('게시물 그룹 1 생성')
    // console.log('게시물 그룹 2 생성')
  }
}
