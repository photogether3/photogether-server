import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const showCollectionValidator = vine.compile(
  vine.object({
    collectionId: vine.number(),
  })
)
export type ShowCollectionDto = Infer<typeof showCollectionValidator>

export const storeCollectionValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(50),
    categoryId: vine.number(),
  })
)
export type StoreCollectionDto = Infer<typeof storeCollectionValidator>

export const updateCollectionValidator = vine.compile(
  vine.object({
    collectionId: vine.number(),
    title: vine.string().minLength(2).maxLength(50),
    categoryId: vine.number(),
  })
)
export type UpdateCollectionDto = Infer<typeof updateCollectionValidator>