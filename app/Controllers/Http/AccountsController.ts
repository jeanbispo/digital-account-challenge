import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AccountScruct from 'App/Models/Account/AccountScruct'
import AccountStorage from 'App/Models/Account/AccountStorage'
import { schema } from '@ioc:Adonis/Core/Validator'
import { v4 as uuidv4 } from 'uuid'
import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'

const accountScruct = new AccountScruct()

export default class AccountsController {
  public async index({ response }: HttpContextContract) {
    try {
      const accountsList = await AccountStorage.getList()
      response.send(accountsList)
    } catch (error) {}
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const newAccountValidator = schema.create({
        type: schema.string({ trim: true }),
        payload: schema.object().members({
          'name': schema.string(),
          'document': schema.string(),
          'available-limit': schema.number(),
        }),
      })

      const body = await request.validate({ schema: newAccountValidator })
      accountScruct.name = body.payload.name
      accountScruct.document = body.payload.document
      accountScruct.UUID = uuidv4()
      accountScruct.availableLimit = body.payload['available-limit']
      accountScruct.timestamp = new Date().valueOf()
      accountScruct.validated = true

      AccountStorage.addToList(accountScruct.getAccountData())

      AccountLimitHistoryStorage.addToList(accountScruct.getAccountLimitHistoryData())

      response.send('accountsList')
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id: uuid } = request.params()
      const acount = AccountStorage.getAccountByField(uuid, 'uuid')
      response.send(acount)
    } catch (error) {}
  }
}
