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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.group(() => {
    const AuthApiController = () => import('#controllers/api/auth_api_controller')
    router.post('/login', [AuthApiController, 'login'])
    router.post('/register', [AuthApiController, 'register'])
    router.post('/otp/generate', [AuthApiController, 'generateOtp'])
    router.post('/otp/verify', [AuthApiController, 'verifyOtp'])
    router.post('/refresh', [AuthApiController, 'refresh'])
    router.delete('/logout', [AuthApiController, 'logout']).middleware(middleware.auth())
  }).prefix('/v1/auth')

  router.group(() => {
    const UserApiController = () => import('#controllers/api/user_api_controller')
    router.get('/emails/:email/duplicated', [UserApiController, 'isEmailTaken'])
    router.get('/me', [UserApiController, 'profile']).middleware(middleware.auth())
    router.put('/me', [UserApiController, 'updateProfile']).middleware(middleware.auth())
    router.put('/password', [UserApiController, 'updatePasswordByOtp'])
    router.put('/me/password', [UserApiController, 'updatePassword']).middleware(middleware.auth())
    router.put('/me/reset', [UserApiController, 'reset']).middleware(middleware.auth())
    router.put('/me/withdraw', [UserApiController, 'withdraw']).middleware(middleware.auth())
  }).prefix('/v1/users')
}).prefix('/api')
