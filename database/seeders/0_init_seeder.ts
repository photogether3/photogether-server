import Category from '#models/category'
import Role, { Roles } from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // 사용자 역할 생성
    await Role.createMany([
      {
        id: Roles.USER,
        name: 'User',
      },
      {
        id: Roles.ADMIN,
        name: 'Admin',
      }
    ])

    // 카테고리 생성
    await Category.createMany([
      {
        id: 1001,
        name: '기술',
      },
      {
        id: 1002,
        name: '건강 & 웰니스',
      },
      {
        id: 1003,
        name: '여행',
      },
      {
        id: 1004,
        name: '금융',
      },
      {
        id: 1005,
        name: '음식 & 요리',
      },
      {
        id: 1006,
        name: '엔터테인먼트',
      },
      {
        id: 1007,
        name: '교육',
      },
      {
        id: 1008,
        name: '스포츠',
      },
      {
        id: 1009,
        name: '비즈니스',
      },
      {
        id: 1010,
        name: '라이프스타일',
      },
    ])
  }
}