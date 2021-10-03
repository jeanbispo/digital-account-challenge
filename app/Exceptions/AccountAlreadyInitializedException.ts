import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountAlreadyInitializedException extends Exception {
  public async handle(error: any, ctx: HttpContextContract) {
    return ctx.response.status(error.status).send({
      type: ctx.request.body().type || 'unknown_type',
      status: 'failure',
      violation: 'account_already_initialized',
    })
  }
}
