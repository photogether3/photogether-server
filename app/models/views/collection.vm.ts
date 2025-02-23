import Collection, { CollectionTypes } from '#models/collection'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { PaginationDto } from './pagination.vm.js'

export class CollectionViewModel {
  declare id: number
  declare title: string
  declare type: CollectionTypes
  declare category: {
    id: number
    name: string
  } | null
  declare postCount: number
  declare imageUrls: string[]
  declare createdAt: DateTime<boolean>
  declare updatedAt: DateTime<boolean>

  static makeWithPaginatedData(collections: ModelPaginatorContract<Collection>) {
    const { meta, data } = collections.serialize()

    const items = data.map((x, i) => this.make(x as Collection, collections[i].$extras))

    return new PaginationDto(meta, items).toData()
  }

  static make(x: Collection, $extras: any = {}) {
    const postCount = Number.parseInt($extras.posts_count) ?? 0
    const imageUrls = x.posts
      .map((y: any) => y.imageUrl)
      .flat()
      .filter((z: any) => z !== null)

    const category = x.category
      ? {
          id: x.category?.id,
          name: x.category?.name,
        }
      : null

    return {
      id: x.id,
      title: x.title,
      type: x.type,
      category,
      postCount,
      imageUrls: imageUrls ?? [],
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }
  }
}
