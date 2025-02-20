import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export function postApiRoutes() {
  router.group(() => {
    const PostApiController = () => import('./post_api_controller.js')
    router.get('', [PostApiController, 'index']).middleware(middleware.auth())
    router.get('/:postId', [PostApiController, 'show']).middleware(middleware.auth())
    router.post('', [PostApiController, 'store'])
      .middleware(middleware.auth())
      .middleware(middleware.drive())
    router.patch('/move', [PostApiController, 'updateWithMove']).middleware(middleware.auth())
    router.put('/:postId', [PostApiController, 'update']).middleware(middleware.auth())
    router.delete('', [PostApiController, 'destroys']).middleware(middleware.auth())
  }).prefix('/v1/posts')
}