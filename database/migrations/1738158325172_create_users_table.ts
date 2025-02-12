import { BaseSchema } from '@adonisjs/lucid/schema'

//ce fichier est une mifration, ça sert à créer les tables de la db avec node ace migration:run
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username', 50).notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.string('password', 500).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
