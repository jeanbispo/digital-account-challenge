import { v4 as uuidv4 } from 'uuid'
import isEmpty from 'is-empty'

import AccountScruct from 'App/Models/Account/AccountScruct'
import AccountStorage from 'App/Models/Account/AccountStorage'
import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'
import AccountAlreadyInitializedException from 'App/Exceptions/AccountAlreadyInitializedException'
import { IstoreAccountBody, IstoreAccountParsedResponse } from './interfaces'

export const indexService = async () => await AccountStorage.getList()

const checkIfAcccountIsDuplicated = async (document: string) => {
  if (!isEmpty(await AccountStorage.getAccountByField(document, 'document')))
    throw new AccountAlreadyInitializedException(
      'account_already_initialized',
      406,
      'E_ACCOUNT_ALREADY_INITIALIZED'
    )
}
export const storeService = async (body: IstoreAccountBody): Promise<any> => {
  try {
    const accountScruct = new AccountScruct()

    await checkIfAcccountIsDuplicated(body.payload.document)
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

export const accountstoreServiceParsed = async (
  body: IstoreAccountBody
): Promise<IstoreAccountParsedResponse> => {
  const accountData = await storeService(body)
  return {
    'name': accountData.name,
    'document': accountData.document,
    'available-limit': (
      await AccountLimitHistoryStorage.getAccountLastValidLimitByField(
        accountData.uuid,
        'accountUUID'
      )
    ).availableLimit,
  }
}

export const showService = async (uuid: string) =>
  await AccountStorage.getAccountByField(uuid, 'uuid')
