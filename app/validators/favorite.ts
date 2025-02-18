import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const storeFavoriteValidator = vine.compile(
  vine.object({
    categoriesIds: vine.array(
      vine.number()
    )
  })
)
export type StoreFavoriteDto = Infer<typeof storeFavoriteValidator>