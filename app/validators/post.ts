import { Exception } from '@adonisjs/core/exceptions'
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
    title: vine.string().maxLength(50),
    content: vine.string().maxLength(50),
    metadataList: vine.array(
      vine.object({
        content: vine.string().maxLength(50),
        isPublic: vine.boolean(),
      })
    ),
  })
)
export type PostStoreDto = Infer<typeof postStoreValidator>

export const updatePostValidator = vine.compile(
  vine.object({
    postId: vine.number(),
    title: vine.string().maxLength(50),
    content: vine.string().maxLength(50),
    metadataList: vine.array(
      vine.object({
        content: vine.string().maxLength(50),
        isPublic: vine.boolean(),
      })
    ),
  })
)
export type UpdatePostDto = Infer<typeof updatePostValidator>

export const parsePostMetadata = (metadataStringify: string) => {
  let metadatas: { content: string, isPublic: boolean, postId: number }[] = []
  try {
    metadatas = JSON.parse(metadataStringify)
  } catch (err) {
    throw new Exception('Invalid metadata stringify', { code: 'E_INVALID_METADATA_STRINGIFY', status: 400 })
  }

  return metadatas ?? []
}