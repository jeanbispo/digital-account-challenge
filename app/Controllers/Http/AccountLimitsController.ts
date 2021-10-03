import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { indexService, showService } from 'App/Services/AccountLimits'

export default class AccountLimitsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsLimitsList = await indexService()
      response.send(
        ResponseBodyTemplate({ type: 'accounts_limits_list', result: accountsLimitsList })
      )
    } catch (error) {
      throw error
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const account = await showService(uuid)
      response.send(ResponseBodyTemplate({ type: 'accounts_limits_show', result: account }))
    } catch (error) {
      throw error
    }
  }
}
