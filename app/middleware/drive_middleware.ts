import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import drive from '@adonisjs/drive/services/main'
import { DateTime } from 'luxon'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    uploadedFileUrl: string | null
  }
}

export default class DriveMiddleware {
  async handle(ctx: HttpContext, next: NextFn, option: { skip?: boolean } = { skip: false }) {
    console.log('=========DriveMiddleware==========')

    const image = ctx.request.file('file', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    if (!image && option.skip) {
      ctx.uploadedFileUrl = null
      return await next()
    }

    if (!image) {
      throw new Exception('Image is required', {
        code: 'E_IMAGE_REQUIRED',
        status: 400,
      })
    }

    try {
      const datePath = DateTime.now().toFormat('yyyy/MM/dd')
      const key = `${datePath}/${cuid()}.${image.extname}`

      await image.moveToDisk(key)
      await drive.use().driver.setVisibility(key, 'public')

      ctx.uploadedFileUrl = await drive.use().getUrl(key)
    } catch (err) {
      console.error(err)
      throw new Exception('Failed to upload image', {
        code: 'E_IMAGE_UPLOAD_FAILED',
        status: 500,
      })
    }

    const output = await next()
    return output
  }
}
