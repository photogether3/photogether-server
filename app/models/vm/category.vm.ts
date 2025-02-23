import Category from '#models/category'

export type CategoryWithFavoriteVm = {
  id: number
  name: string
  isFavorite: boolean
}

export class CategoryVmFactory {
  constructor(private readonly category: Category) {}

  toWithFavorite(userId: number) {
    const isFavorite = this.category.favoriteUsers.some((user) => user.id === userId)
    return {
      id: this.category.id,
      name: this.category.name,
      isFavorite,
    } as CategoryWithFavoriteVm
  }
}
