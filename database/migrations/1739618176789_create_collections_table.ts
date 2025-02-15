import { CollectionTypes } from '#models/collection'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('category_id').nullable().unsigned().references('id').inTable('categories')
      table.string('type', 20).notNullable().defaultTo(CollectionTypes.DEFAULT)
      table.string('title', 50).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}