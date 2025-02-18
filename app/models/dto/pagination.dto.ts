
export class PaginationDto {
  constructor(
    private readonly meta: any,
    private readonly items: any[]
  ) { }

  toData() {
    return {
      perPage: this.meta.perPage,
      totalItemCount: this.meta.total,
      totalPageCount: this.meta.lastPage,
      currentPage: this.meta.currentPage,
      items: this.items,
    }
  }
}