/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UserWebController = () => import('#controllers/web/user_web_controller')
const CategoryWebController = () => import('#controllers/web/category_web_controller')

router.get('/favicon.ico', async ({ response }) => {
  return response.status(204).send('')
})

router
  .get('/', async (ctx) => {
    return ctx.view.render('pages/dashboard')
  })
  .as('dashboard')

router
  .group(() => {
    router.get('', [UserWebController, 'index']).as('users.index')
  })
  .prefix('/users')

router
  .group(() => {
    router.get('', [CategoryWebController, 'index']).as('categories.index')
  })
  .prefix('/categories')

router
  .group(() => {
    router
      .group(() => {
        const AuthApiController = () => import('#controllers/api/auth_api_controller')
        router.post('/login', [AuthApiController, 'login'])
        router.post('/register', [AuthApiController, 'register'])
        router.post('/otp/generate', [AuthApiController, 'generateOtp'])
        router.post('/otp/verify', [AuthApiController, 'verifyOtp'])
        router.post('/refresh', [AuthApiController, 'refresh'])
        router.delete('/logout', [AuthApiController, 'logout']).middleware(middleware.auth())
      })
      .prefix('/v1/auth')

    router
      .group(() => {
        const UserApiController = () => import('#controllers/api/user_api_controller')
        router.get('/emails/:email/duplicated', [UserApiController, 'isEmailTaken'])
        router.get('/me', [UserApiController, 'profile']).middleware(middleware.auth())
        router
          .put('/me', [UserApiController, 'updateProfile'])
          .middleware(middleware.auth())
          .middleware(middleware.drive({ skip: true }))
        router.patch('/password', [UserApiController, 'updatePasswordByOtp'])
        router
          .patch('/me/password', [UserApiController, 'updatePassword'])
          .middleware(middleware.auth())
        router.delete('/me/reset', [UserApiController, 'reset']).middleware(middleware.auth())
        router.delete('/me/withdraw', [UserApiController, 'withdraw']).middleware(middleware.auth())
      })
      .prefix('/v1/users')

    router
      .group(() => {
        const CategoryApiController = () => import('#controllers/api/category_api_controller')
        router.get('', [CategoryApiController, 'index'])
        router
          .get('/with-favorite-status', [CategoryApiController, 'indexWithFavorite'])
          .middleware(middleware.auth())
        router.post('', [CategoryApiController, 'store'])
        router.delete('/:categoryId', [CategoryApiController, 'destroy'])
      })
      .prefix('/v1/categories')

    router
      .group(() => {
        const FavoriteApiController = () => import('#controllers/api/favorite_api_controller')
        router.get('', [FavoriteApiController, 'index']).middleware(middleware.auth())
        router.put('', [FavoriteApiController, 'storeOrUpdate']).middleware(middleware.auth())
      })
      .prefix('/v1/favorites')

    router
      .group(() => {
        const CollectionApiController = () => import('#controllers/api/collection_api_controller')
        router.get('', [CollectionApiController, 'index']).middleware(middleware.auth())
        router
          .get('/:collectionId', [CollectionApiController, 'show'])
          .middleware(middleware.auth())
        router.post('', [CollectionApiController, 'store']).middleware(middleware.auth())
        router
          .put('/:collectionId', [CollectionApiController, 'update'])
          .middleware(middleware.auth())
        router
          .delete('/:collectionId', [CollectionApiController, 'destroy'])
          .middleware(middleware.auth())
      })
      .prefix('/v1/collections')

    router
      .group(() => {
        const PostApiController = () => import('#controllers/api/post_api_controller')
        router.get('', [PostApiController, 'index']).middleware(middleware.auth())
        router.get('/:postId', [PostApiController, 'show']).middleware(middleware.auth())
        router
          .post('', [PostApiController, 'store'])
          .middleware(middleware.auth())
          .middleware(middleware.drive())
        router.patch('/move', [PostApiController, 'updateWithMove']).middleware(middleware.auth())
        router.put('/:postId', [PostApiController, 'update']).middleware(middleware.auth())
        router.delete('', [PostApiController, 'destroys']).middleware(middleware.auth())
      })
      .prefix('/v1/posts')
  })
  .prefix('/api')
