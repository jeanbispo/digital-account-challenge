import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import TransactionHistoryStorage from 'App/Models/TransactionHistory/TransactionHistoryStorage'
import { storeTransaction } from 'App/Services/TransactionsService'

export default class TransactionsController {
  public async index({ response }: HttpContextContract) {
    try {
      const transactionsList = await TransactionHistoryStorage.getList()
      response.send(transactionsList)
    } catch (error) {}
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const eventPayload = await storeTransaction(request)
      Event.emit('transaction', eventPayload)

      response.send('accountsList')
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({}: HttpContextContract) {}
}
