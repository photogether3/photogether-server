import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export function categoryApiRoutes() {
  router.group(() => {
    const CategoryApiController = () => import('./category_api_controller.js')
    router.get('', [CategoryApiController, 'index'])
    router.get('/with-favorite-status', [CategoryApiController, 'indexWithFavorite']).middleware(middleware.auth())
    router.post('', [CategoryApiController, 'store'])
    router.delete('/:categoryId', [CategoryApiController, 'destroy'])
  }).prefix('/v1/categories')
}

export function favoriteApiRoutes() {
  router.group(() => {
    const FavoriteApiController = () => import('./favorite_api_controller.js')
    router.get('', [FavoriteApiController, 'index']).middleware(middleware.auth())
    router.put('', [FavoriteApiController, 'storeOrUpdate']).middleware(middleware.auth())
  }).prefix('/v1/favorites')
}