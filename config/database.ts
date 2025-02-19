import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'postgres',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        database: env.get('DB_NAME'),
        user: env.get('DB_USERNAME'),
        password: env.get('DB_PASSWORD')
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig