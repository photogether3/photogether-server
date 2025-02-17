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
}).middleware(middleware.auth())

router.group(() => {
  router.group(() => {
    const AuthApiController = () => import('#controllers/api/auth_api_controller')
    router.post('/login', [AuthApiController, 'login'])
    router.post('/register', [AuthApiController, 'register'])
    router.post('/otp/generate', [AuthApiController, 'generateOtp'])
    router.post('/otp/verify', [AuthApiController, 'verifyOtp'])
    router.post('/refresh', [AuthApiController, 'refresh'])
    router.post('/logout', [AuthApiController, 'logout'])
  }).prefix('/v1/auth')
}).prefix('/api')
