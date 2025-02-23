export class PaginationDto {
  constructor(
    private readonly meta: any,
    private readonly items: any[]
  ) {}

  toData() {
    console.log(this.meta)
    console.log('======================')
    console.log(this.items)

    return {
      perPage: this.meta.perPage,
      totalItemCount: this.meta.total,
      totalPageCount: this.meta.lastPage,
      currentPage: this.meta.currentPage,
      items: this.items,
    }
  }
}
