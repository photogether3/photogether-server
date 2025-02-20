import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export function authApiRoutes() {
  router.group(() => {
    const AuthApiController = () => import('./auth_api_controller.js')
    router.post('/login', [AuthApiController, 'login'])
    router.post('/register', [AuthApiController, 'register'])
    router.post('/otp/generate', [AuthApiController, 'generateOtp'])
    router.post('/otp/verify', [AuthApiController, 'verifyOtp'])
    router.post('/refresh', [AuthApiController, 'refresh'])
    router.delete('/logout', [AuthApiController, 'logout']).middleware(middleware.auth())
  }).prefix('/v1/auth')
}

export function userApiRoutes() {
  router.group(() => {
    const UserApiController = () => import('./user_api_controller.js')
    router.get('/emails/:email/duplicated', [UserApiController, 'isEmailTaken'])
    router.get('/me', [UserApiController, 'profile']).middleware(middleware.auth())
    router.put('/me', [UserApiController, 'updateProfile'])
      .middleware(middleware.auth())
      .middleware(middleware.drive())
    router.patch('/password', [UserApiController, 'updatePasswordByOtp'])
    router.patch('/me/password', [UserApiController, 'updatePassword']).middleware(middleware.auth())
    router.delete('/me/reset', [UserApiController, 'reset']).middleware(middleware.auth())
    router.delete('/me/withdraw', [UserApiController, 'withdraw']).middleware(middleware.auth())
  }).prefix('/v1/users')
}
