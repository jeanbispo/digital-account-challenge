import { accountstoreServiceParsed } from 'App/Services/Accounts'
import {
  transactionShowHistoryServiceParsed,
  transactionStoreServiceParsed,
} from 'App/Services/Transactions'
import test from 'japa'
import { mockStoreAccount } from './mocks/account.mock'
import { mockStoreTransaction } from './mocks/transaction.mock'
import { mockGetTransactionHistory } from './mocks/transactionHistory.mock'

test.group('Complete Test', () => {
  const acount1 = mockStoreAccount()
  const acount2 = mockStoreAccount()

  test('Has diferent mock accounts', async (assert) => {
    assert.notDeepEqual(acount1, acount2)
  })

  test('If Initialize Account 1', async (assert) => {
    const response = await accountstoreServiceParsed(acount1)
    assert.deepEqual(response, acount1.payload)
  })

  test('If Initialize Account 2', async (assert) => {
    const response = await accountstoreServiceParsed(acount2)
    assert.deepEqual(response.document, acount2.payload.document)
  })

  test('If transaction history is empty: Account 1', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount1.payload.document)
    const response = await transactionShowHistoryServiceParsed(transactionHistory)
    assert.isArray(response)
    assert.lengthOf(response, 0)
  })

  test('If transaction history is empty: Account 2', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount2.payload.document)
    const response = await transactionShowHistoryServiceParsed(transactionHistory)
    assert.isArray(response)
    assert.lengthOf(response, 0)
  })

  test('transaction', async (assert) => {
    const transaction = mockStoreTransaction(acount1.payload.document, acount2.payload.document)
    const response = await transactionStoreServiceParsed(transaction)
    assert.equal(
      response['available-limit'],
      acount1.payload['available-limit'] - transaction.payload.value
    )
  })

  test('Has transaction history : Account 1', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount1.payload.document)
    const response = await transactionShowHistoryServiceParsed(transactionHistory)
    assert.isArray(response)
    assert.lengthOf(response, 1)
  })

  test('Has transaction history : Account 1', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount2.payload.document)
    const response = await transactionShowHistoryServiceParsed(transactionHistory)
    assert.isArray(response)
    assert.lengthOf(response, 1)
  })
})
