import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { storeService, indexService, showHistoryService } from 'App/Services/Transactions'
import ResponseBodyTemplate from 'App/Helpers/responseBodyTemplate'

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
      const eventPayload = await storeService(request)
      Event.emit('transaction', eventPayload)

      response.send(ResponseBodyTemplate({ type: 'transaction', result: eventPayload.transaction }))
    } catch (error) {
      throw error
    }
  }
  //TODO: show ou remover o recurso
  public async show({}: HttpContextContract) {}

  public async history({ request, response }: HttpContextContract) {
    try {
      const account = await showHistoryService(request)
      response.send(ResponseBodyTemplate({ type: 'transaction_history', result: account }))
    } catch (error) {
      throw error
    }
  }
}
