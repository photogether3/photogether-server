import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_metadata'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('post_id').unsigned().references('posts.id').notNullable()
      table.integer('rank').notNullable().defaultTo(1)
      table.string('content', 50).notNullable()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
