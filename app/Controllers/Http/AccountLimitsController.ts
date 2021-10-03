import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { indexService, showService } from 'App/Services/AccountLimits'

export default class AccountLimitsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsList = await indexService()
      response.send(accountsList)
    } catch (error) {}
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const account = await showService(uuid)
      response.send(account)
    } catch (error) {}
  }
}
