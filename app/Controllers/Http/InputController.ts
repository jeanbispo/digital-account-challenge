import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidDataException from 'App/Exceptions/InvalidDataException'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { accountstoreServiceParsed } from 'App/Services/Accounts'
import { newAccountValidator } from 'App/Services/Accounts/validators'
import {
  transactionShowHistoryServiceParsed,
  transactionStoreServiceParsed,
} from 'App/Services/Transactions'
import { newTransactionValidator, showHistoryValidator } from 'App/Services/Transactions/validators'

const services = {
  initialize_account: {
    exec: accountstoreServiceParsed,
    schema: newAccountValidator,
  },
  transaction: { exec: transactionStoreServiceParsed, schema: newTransactionValidator },
  transaction_history: { exec: transactionShowHistoryServiceParsed, schema: showHistoryValidator },
}

export default class InputsController {
  public async input({ request, response }: HttpContextContract) {
    try {
      const { type } = request.body()
      if (!type || !services.hasOwnProperty(type))
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')

      const body = await request.validate({ schema: services[type].schema })

      response.send(ResponseBodyTemplate({ type, result: await services[type].exec(body) }))
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE')
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
      throw error
    }
  }
}
