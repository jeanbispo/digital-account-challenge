import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { storeService, indexService } from 'App/Services/TransactionsService'

export default class TransactionsController {
  public async index({ response }: HttpContextContract) {
    try {
      const transactionsList = indexService()
      response.send(transactionsList)
    } catch (error) {}
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const eventPayload = await storeService(request)
      Event.emit('transaction', eventPayload)

      response.send('accountsList')
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({}: HttpContextContract) {}
}
