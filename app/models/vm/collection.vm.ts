import Collection from '#models/collection'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { PaginationDto } from './pagination.vm.js'

export type CollectionVm = {
  id: number
  title: string
  category: {
    id: number
    name: string
  } | null
  postCount: number
  imageUrls: string[]
  createdAt: DateTime<boolean>
  updatedAt: DateTime<boolean>
}

export class CollectionVmFactory {
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
      category,
      postCount,
      type: x.type,
      imageUrls: imageUrls ?? [],
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    } as CollectionVm
  }
}
