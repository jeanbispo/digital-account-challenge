import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidDataException from 'App/Exceptions/InvalidDataException'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { indexService, showService, storeService } from 'App/Services/Accounts'
import { newAccountValidator } from 'App/Services/Accounts/validators'

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
      const body = await request.validate({ schema: newAccountValidator })
      const account = await storeService(body)

      response.send(ResponseBodyTemplate({ type: 'initialize_account', result: account }))
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE')
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
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
