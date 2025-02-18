import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const postIndexValidator = vine.compile(
  vine.object({
    page: vine.number(),
    perPage: vine.number(),
    sortOrder: vine.enum(['asc', 'desc']),
    sortBy: vine.enum(['id', 'created_at']),
    collectionId: vine.number(),
  })
)
export type PostIndexDto = Infer<typeof postIndexValidator>

export const defaultPostIndexDto = {
  page: 1,
  perPage: 10,
  sortOrder: 'desc',
  sortBy: 'created_at',
}

export const postStoreValidator = vine.compile(
  vine.object({
    collectionId: vine.number(),
    title: vine.string(),
    content: vine.string(),
    metadataStringify: vine.string(),
  })
)
export type PostStoreDto = Infer<typeof postStoreValidator>