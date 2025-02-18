import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('roles.id').notNullable()
      table.string('nickname', 20).notNullable()
      table.text('bio').nullable()
      table.string('email', 50).notNullable().unique()
      table.boolean('is_email_verified').notNullable().defaultTo(1)
      table.string('password', 200).notNullable()
      table.string('otp', 6).nullable()
      table.timestamp('otp_expiry_date').nullable()
      table.string('image_url', 255).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}