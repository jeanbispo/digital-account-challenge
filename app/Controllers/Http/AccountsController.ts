import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { indexService, showService, storeService } from 'App/Services/Accounts'

export default class AccountsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsList = await indexService()
      response.send(ResponseBodyTemplate({ type: 'account_list', result: accountsList }))
    } catch (error) {
      throw error
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const account = await storeService(request)

      response.send(ResponseBodyTemplate({ type: 'initialize_account', result: account }))
    } catch (error) {
      throw error
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const account = await showService(uuid)
      response.send(ResponseBodyTemplate({ type: 'account_show', result: account }))
    } catch (error) {
      throw error
    }
  }
}
