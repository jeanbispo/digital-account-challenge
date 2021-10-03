import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'

export default class AccountLimitsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsList = AccountLimitHistoryStorage.getList()
      response.send(accountsList)
    } catch (error) {}
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const account = AccountLimitHistoryStorage.getAccountLimitHistoryByField(uuid, 'uuid')
      response.send(account)
    } catch (error) {}
  }
}
