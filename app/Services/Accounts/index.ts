import { RequestContract } from '@ioc:Adonis/Core/Request'
import { schema } from '@ioc:Adonis/Core/Validator'
import { v4 as uuidv4 } from 'uuid'

import AccountScruct from 'App/Models/Account/AccountScruct'
import AccountStorage from 'App/Models/Account/AccountStorage'
import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'

export const indexService = async () => await AccountStorage.getList()
export const storeService = async (request: RequestContract): Promise<any> => {
  try {
    const accountScruct = new AccountScruct()

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

    const account = accountScruct.getAccountData()
    AccountStorage.addToList(account)

    AccountLimitHistoryStorage.addToList(accountScruct.getAccountLimitHistoryData())

    return account
  } catch (error) {
    throw error
  }
}

export const showService = async (uuid: string) =>
  await AccountStorage.getAccountByField(uuid, 'uuid')
