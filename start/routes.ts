/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { categoryApiRoutes, favoriteApiRoutes } from '#features/category'
import { collectionApiRoutes } from '#features/collection'
import { postApiRoutes } from '#features/post'
import { authApiRoutes, userApiRoutes } from '#features/user'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return { hello: 'world' }
})

router.group(() => {
  authApiRoutes()
  userApiRoutes()
  categoryApiRoutes()
  favoriteApiRoutes()
  collectionApiRoutes()
  postApiRoutes()
}).prefix('/api')
