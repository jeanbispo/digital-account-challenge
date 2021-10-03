import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { indexService, showService, storeService } from 'App/Services/AccountsService'

export default class AccountsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsList = await indexService()
      response.send(accountsList)
    } catch (error) {}
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const account = await storeService(request)

      response.send(account)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const account = await showService(uuid)
      response.send(account)
    } catch (error) {}
  }
}
