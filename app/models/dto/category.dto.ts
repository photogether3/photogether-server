import Category from "#models/category";

export class CategoryDto {
  constructor(
    private readonly category: Category
  ) { }

  toWithFavorite(userId: number) {
    const isFavorite = this.category.favoriteUsers.some(
      user => user.id === userId
    )
    return {
      id: this.category.id,
      name: this.category.name,
      isFavorite,
    }
  }
}