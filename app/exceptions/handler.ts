import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const err: any = error
    console.log(err)
    if (err instanceof errors.E_VALIDATION_ERROR) {
      return ctx.response.badRequest({
        statusCode: 400,
        code: err.code,
        message: err.messages[0].message,
      })
    }

    return ctx.response.badRequest({
      statusCode: err.status ?? 500,
      code: err.code,
      message: err.message,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
