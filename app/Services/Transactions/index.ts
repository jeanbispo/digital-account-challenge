import { RequestContract } from '@ioc:Adonis/Core/Request'
import { schema } from '@ioc:Adonis/Core/Validator'
import isEmpty from 'is-empty'
import { v4 as uuidv4 } from 'uuid'
import { DateTime, Interval } from 'luxon'
import AccountStorage from 'App/Models/Account/AccountStorage'
import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'
import AccountLimitHistoryScruct from 'App/Models/AccountLimitHistory/AccountLimitHistoryScruct'
import TransactionHistoryStorage from 'App/Models/TransactionHistory/TransactionHistoryStorage'
import TransactionHistorySctruct from 'App/Models/TransactionHistory/TransactionHistorySctruct'
import {
  IcreateNewAccountsLimitsPayload,
  IlaunchTransactionPayload,
  ItransactionEventPayload,
} from './interfaces'

export const indexService = async () => await TransactionHistoryStorage.getList()

const checkIfAccountsExist = async (
  senderDocument: string,
  receiverDocument: string
): Promise<{ senderUUID: string; receiverUUID: string }> => {
  try {
    const senderAccount = AccountStorage.getAccountByField(senderDocument, 'document')
    const receiverAccount = AccountStorage.getAccountByField(receiverDocument, 'document')
    if (isEmpty(senderAccount) || isEmpty(receiverAccount)) throw 'account_not_initialized'
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
    if (duplicateTransactionsHistoric.length) throw 'double_transaction'
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
    if (isEmpty(senderAccountLimit)) throw 'insufficient_limit'
    if (senderAccountLimit.availableLimit - transactionValue < 0) throw 'insufficient_limit'
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

const createNewAccountLimit = async (payload: IcreateNewAccountsLimitsPayload) => {
  const accountLimitHistoryScruct = new AccountLimitHistoryScruct()
  accountLimitHistoryScruct.accountUUID = payload.accountUUID
  accountLimitHistoryScruct.availableLimit = payload.availableLimit
  accountLimitHistoryScruct.timestamp = new Date().valueOf()
  accountLimitHistoryScruct.validated = false

  const newAccountLimit = accountLimitHistoryScruct.getAccountLimitHistoryData()
  AccountLimitHistoryStorage.addToList(newAccountLimit)

  return newAccountLimit
}

export const storeService = async (request: RequestContract): Promise<ItransactionEventPayload> => {
  try {
    const newTransactionValidator = schema.create({
      type: schema.string({ trim: true }),
      payload: schema.object().members({
        'sender-document': schema.string(),
        'receiver-document': schema.string(),
        'value': schema.number(),
        'datetime': schema.string(),
      }),
    })

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
    })

    const receiverAccountLimit = await createNewAccountLimit({
      accountUUID: receiverUUID,
      availableLimit: receiverLimit + body.payload.value,
    })

    return {
      transaction,
      senderAccountLimit,
      receiverAccountLimit,
    }
  } catch (error) {
    throw error
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
