import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import {
  storeService,
  indexService,
  showHistoryService,
  showService,
} from 'App/Services/Transactions'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'
import { newTransactionValidator, showHistoryValidator } from 'App/Services/Transactions/validators'
import InvalidDataException from 'App/Exceptions/InvalidDataException'

export default class TransactionsController {
  public async index({ response }: HttpContextContract) {
    try {
      const transactionsList = await indexService()
      response.send(ResponseBodyTemplate({ type: 'transaction_list', result: transactionsList }))
    } catch (error) {
      throw error
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const body = await request.validate({ schema: newTransactionValidator })
      const eventPayload = await storeService(body)
      Event.emit('transaction', eventPayload)

      response.send(ResponseBodyTemplate({ type: 'transaction', result: eventPayload.transaction }))
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE')
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
      throw error
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const transactions = await showService(uuid)
      response.send(ResponseBodyTemplate({ type: 'transaction_show', result: transactions }))
    } catch (error) {
      throw error
    }
  }

  public async history({ request, response }: HttpContextContract) {
    try {
      const body = await request.validate({ schema: showHistoryValidator })
      const account = await showHistoryService(body)
      response.send(ResponseBodyTemplate({ type: 'transaction_history', result: account }))
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE')
        throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
      throw error
    }
  }
}
