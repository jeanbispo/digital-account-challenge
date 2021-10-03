import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidDataException from 'App/Exceptions/InvalidDataException'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { accountstoreServiceParsed } from 'App/Services/Accounts'
import {
  transactionShowHistoryServiceParsed,
  transactionStoreServiceParsed,
} from 'App/Services/Transactions'

const services = {
  initialize_account: accountstoreServiceParsed,
  transaction: transactionStoreServiceParsed,
  transaction_history: transactionShowHistoryServiceParsed,
}

export default class InputsController {
  public async input({ request, response }: HttpContextContract) {
    try {
      const { type } = request.body()
      if (!type || !services.hasOwnProperty(type))
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
      response.send(ResponseBodyTemplate({ type, result: await services[type](request) }))
    } catch (error) {
      throw error
    }
  }
}
