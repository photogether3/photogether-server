import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export function collectionApiRoutes() {
  router.group(() => {
    const CollectionApiController = () => import('./collection_api_controller.js')
    router.get('', [CollectionApiController, 'index']).middleware(middleware.auth())
    router.get('/:collectionId', [CollectionApiController, 'show']).middleware(middleware.auth())
    router.post('', [CollectionApiController, 'store']).middleware(middleware.auth())
    router.put('/:collectionId', [CollectionApiController, 'update']).middleware(middleware.auth())
  }).prefix('/v1/collections')
}