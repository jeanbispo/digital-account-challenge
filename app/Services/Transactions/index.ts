import { RequestContract } from '@ioc:Adonis/Core/Request'
import isEmpty from 'is-empty'
import { v4 as uuidv4 } from 'uuid'
import { DateTime, Interval } from 'luxon'
import AccountStorage from 'App/Models/Account/AccountStorage'
import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'
import AccountLimitHistoryScruct from 'App/Models/AccountLimitHistory/AccountLimitHistoryScruct'
import TransactionHistoryStorage from 'App/Models/TransactionHistory/TransactionHistoryStorage'
import TransactionHistorySctruct from 'App/Models/TransactionHistory/TransactionHistorySctruct'
import DoubleTransactionException from 'App/Exceptions/DoubleTransactionException'
import InsufficientLimitException from 'App/Exceptions/InsufficientLimitException'
import AccountNotInitializedException from 'App/Exceptions/AccountNotInitializedException'
import {
  IcreateNewAccountsLimitsPayload,
  IlaunchTransactionPayload,
  ItransactionEventPayload,
} from './interfaces'
import { newTransactionValidator, showHistoryValidator } from './validators'
import InvalidDataException from 'App/Exceptions/InvalidDataException'

export const indexService = async () => await TransactionHistoryStorage.getList()

const checkIfAccountsExist = async (
  senderDocument: string,
  receiverDocument: string
): Promise<{ senderUUID: string; receiverUUID: string }> => {
  try {
    const senderAccount = AccountStorage.getAccountByField(senderDocument, 'document')
    const receiverAccount = AccountStorage.getAccountByField(receiverDocument, 'document')
    if (isEmpty(senderAccount) || isEmpty(receiverAccount))
      throw new AccountNotInitializedException(
        'account_not_initialized',
        406,
        'E_ACCOUNT_NOT_INITIALIZED'
      )
    return { senderUUID: senderAccount.uuid, receiverUUID: receiverAccount.uuid }
  } catch (error) {
    throw error
  }
}

const checkForDuplicateTransaction = async (
  senderUUID: string,
  receiverUUID: string,
  value: number
): Promise<any> => {
  try {
    const duplicateTransactionsHistoric = (await TransactionHistoryStorage.getList()).filter(
      (transaciton) => {
        const now = DateTime.now()
        const transactionDateTime = DateTime.fromMillis(transaciton.datetime)
        const intervalDateTimes =
          Interval.fromDateTimes(transactionDateTime, now).toDuration('minutes').toObject()
            .minutes || 0

        return (
          intervalDateTimes < 2 &&
          transaciton.receiverUUID === receiverUUID &&
          transaciton.senderUUID === senderUUID &&
          transaciton.value === value
        )
      }
    )
    if (duplicateTransactionsHistoric.length)
      throw new DoubleTransactionException('double_transaction', 406, 'E_DOUBLE_TRANSACTION')
  } catch (error) {
    throw error
  }
}

const checkIfAccountsHaveLimit = async (
  senderUUID: string,
  receiverUUID: string,
  transactionValue: number
): Promise<{ senderLimit: number; receiverLimit: number }> => {
  try {
    const senderAccountLimit = await AccountLimitHistoryStorage.getAccountLastValidLimitByField(
      senderUUID,
      'accountUUID'
    )
    const receiverAccountLimit = await AccountLimitHistoryStorage.getAccountLastValidLimitByField(
      receiverUUID,
      'accountUUID'
    )
    if (isEmpty(senderAccountLimit))
      throw new InsufficientLimitException('insufficient_limit', 406, 'E_INSUFFICIENT_LIMIT')
    if (senderAccountLimit.availableLimit - transactionValue < 0)
      throw new InsufficientLimitException('insufficient_limit', 406, 'E_INSUFFICIENT_LIMIT')
    return {
      senderLimit: senderAccountLimit.availableLimit,
      receiverLimit: receiverAccountLimit.availableLimit,
    }
  } catch (error) {
    throw error
  }
}

const launchTransaction = async (payload: IlaunchTransactionPayload): Promise<any> => {
  const transactionHistorySctruct = new TransactionHistorySctruct()

  transactionHistorySctruct.UUID = uuidv4()
  transactionHistorySctruct.confirmed = false
  transactionHistorySctruct.senderUUID = payload.senderUUID
  transactionHistorySctruct.receiverUUID = payload.receiverUUID
  transactionHistorySctruct.value = payload.value
  transactionHistorySctruct.datetime = payload.datetime

  const transaction = transactionHistorySctruct.getTransactionData()
  TransactionHistoryStorage.addToList(transaction)

  return transaction
}

const createNewAccountLimit = async (payload: IcreateNewAccountsLimitsPayload): Promise<any> => {
  const accountLimitHistoryScruct = new AccountLimitHistoryScruct()
  accountLimitHistoryScruct.accountUUID = payload.accountUUID
  accountLimitHistoryScruct.availableLimit = payload.availableLimit
  accountLimitHistoryScruct.timestamp = new Date().valueOf()
  accountLimitHistoryScruct.lastTransactionUUID = payload.lastTransactionUUID
  accountLimitHistoryScruct.validated = false

  const newAccountLimit = accountLimitHistoryScruct.getAccountLimitHistoryData()
  AccountLimitHistoryStorage.addToList(newAccountLimit)

  return newAccountLimit
}

export const storeService = async (request: RequestContract): Promise<ItransactionEventPayload> => {
  try {
    const body = await request.validate({ schema: newTransactionValidator })

    const { senderUUID, receiverUUID } = await checkIfAccountsExist(
      body.payload['sender-document'],
      body.payload['receiver-document']
    )

    await checkForDuplicateTransaction(senderUUID, receiverUUID, body.payload['value'])

    const { senderLimit, receiverLimit } = await checkIfAccountsHaveLimit(
      senderUUID,
      receiverUUID,
      body.payload.value
    )

    const transaction = await launchTransaction({
      senderUUID,
      receiverUUID,
      value: body.payload.value,
      datetime: new Date(body.payload.datetime).valueOf(),
    })

    const senderAccountLimit = await createNewAccountLimit({
      accountUUID: senderUUID,
      availableLimit: senderLimit - body.payload.value,
      lastTransactionUUID: transaction.uuid,
    })

    const receiverAccountLimit = await createNewAccountLimit({
      accountUUID: receiverUUID,
      availableLimit: receiverLimit + body.payload.value,
      lastTransactionUUID: transaction.uuid,
    })

    return {
      transaction,
      senderAccountLimit,
      receiverAccountLimit,
    }
  } catch (error) {
    if (error.code === 'E_VALIDATION_FAILURE')
      throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
    throw error
  }
}

export const transactionStoreServiceParsed = async (request: RequestContract): Promise<any> => {
  const transacitionData = await storeService(request)
  return {
    'available-limit': transacitionData.senderAccountLimit.availableLimit,
    'receiver-document': AccountStorage.getAccountByField(
      transacitionData.transaction.receiverUUID,
      'uuid'
    ).document,
    'sender-document': AccountStorage.getAccountByField(
      transacitionData.transaction.senderUUID,
      'uuid'
    ).document,
    'datetime': new Date(transacitionData.transaction.datetime).toISOString(),
  }
}

export const confirmTransaction = async ({
  transaction,
  senderAccountLimit,
  receiverAccountLimit,
}: ItransactionEventPayload) => {
  try {
    AccountLimitHistoryStorage.changeAccountLimitByUUID(senderAccountLimit.uuid, {
      ...senderAccountLimit,
      validated: true,
    })

    AccountLimitHistoryStorage.changeAccountLimitByUUID(receiverAccountLimit.uuid, {
      ...receiverAccountLimit,
      validated: true,
    })

    TransactionHistoryStorage.changeTransactionByUUID(transaction.uuid, {
      ...transaction,
      confirmed: true,
    })
  } catch (error) {
    throw error
  }
}

export const showService = async (uuid: string) => {
  try {
  } catch (error) {
    throw error
  }
}

export const showHistoryService = async (request: RequestContract) => {
  try {
    const body = await request.validate({ schema: showHistoryValidator })

    const account = await AccountStorage.getAccountByField(body.payload.document, 'document')
    if (isEmpty(account))
      throw new AccountNotInitializedException(
        'account_not_initialized',
        406,
        'E_ACCOUNT_NOT_INITIALIZED'
      )
    const history = Promise.all(
      (await TransactionHistoryStorage.getTransactionListByUUID(account.uuid)).map(
        async (transaction) => {
          return {
            ...transaction,
            senderDocument: (await AccountStorage.getAccountByField(transaction.senderUUID, 'uuid'))
              .document,
            receiverDocument: (
              await AccountStorage.getAccountByField(transaction.receiverUUID, 'uuid')
            ).document,
            availableLimit: AccountLimitHistoryStorage.getAccountLimitByField(
              transaction.uuid,
              'lastTransactionUUID'
            ).availableLimit,
          }
        }
      )
    )
    return history
  } catch (error) {
    if (error.code === 'E_VALIDATION_FAILURE')
      throw new InvalidDataException('invalid_data', 406, 'E_INVALID_DATA')
    throw error
  }
}

export const transactionShowHistoryServiceParsed = async (request: RequestContract) => {
  const transacitionHistoryData = await showHistoryService(request)

  return Promise.all(
    await transacitionHistoryData.map(async (transaciton: any) => {
      return {
        'sender-document': AccountStorage.getAccountByField(transaciton.senderUUID, 'uuid')
          .document,
        'receiver-document': AccountStorage.getAccountByField(transaciton.receiverUUID, 'uuid')
          .document,
        'value': transaciton.value,
        'datetime': new Date(transaciton.datetime).toISOString(),
        'available-limit': transaciton.availableLimit,
      }
    })
  )
}
