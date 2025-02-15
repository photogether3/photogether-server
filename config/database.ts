import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      // client: 'better-sqlite3',
      // connection: {
      //   filename: app.tmpPath('db.sqlite3')
      // },
      client: 'libsql',
      connection: {
        filename: env.get('DATABASE_URL')
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      }
    },
  },
})

export default dbConfig