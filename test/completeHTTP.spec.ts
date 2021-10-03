import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

import { mockStoreAccount } from './mocks/account.mock'
import { mockStoreTransaction } from './mocks/transaction.mock'
import { mockGetTransactionHistory } from './mocks/transactionHistory.mock'
import deepClone from 'App/Helpers/deepClone'
import { accountAlreadyInitialized, doubleTransaction, invalidData } from './mocks/errors.mock'

test.group('Complete HTTP Test', () => {
  const acount1 = mockStoreAccount()
  const acount2 = mockStoreAccount()

  test('Has diferent mock accounts', async (assert) => {
    assert.notDeepEqual(acount1, acount2)
  })

  test('If Initialize Account 1', async () => {
    await supertest(BASE_URL).post('/input').send(acount1).expect(200)
  })

  test('If Initialize Account 2', async () => {
    await supertest(BASE_URL).post('/input').send(acount2).expect(200)
  })

  test('If Initialize Account duplicated', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/input').send(acount1).expect(406)
    const response = JSON.parse(text)
    console.log(response)
    assert.deepEqual(response, accountAlreadyInitialized('initialize_account'))
  })

  test('If Initialize Account with invalid Data', async (assert) => {
    const invalidBody: any = deepClone(acount1)
    delete invalidBody.payload.document
    const { text } = await supertest(BASE_URL).post('/input').send(invalidBody).expect(406)
    const response = JSON.parse(text)
    assert.deepEqual(response, invalidData('initialize_account'))
  })

  test('If transaction history is empty: Account 1', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount1.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transactionHistory).expect(200)
    const response = JSON.parse(text)
    assert.isArray(response.result)
    assert.lengthOf(response.result, 0)
  })

  test('If transaction history is empty: Account 2', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount2.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transactionHistory).expect(200)
    const response = JSON.parse(text)
    assert.isArray(response.result)
    assert.lengthOf(response.result, 0)
  })

  test('Transaction', async (assert) => {
    const transaction = mockStoreTransaction(acount1.payload.document, acount2.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transaction).expect(200)
    const response = JSON.parse(text)
    assert.equal(
      response.result['available-limit'],
      acount1.payload['available-limit'] - transaction.payload.value
    )
  })

  test('If double transaction', async (assert) => {
    const transaction = mockStoreTransaction(acount1.payload.document, acount2.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transaction).expect(406)
    const response = JSON.parse(text)
    assert.deepEqual(response, doubleTransaction('transaction'))
  })

  test('If transaction with invalid data', async (assert) => {
    const transaction: any = mockStoreTransaction(
      acount1.payload.document,
      acount2.payload.document
    )
    delete transaction.payload.value
    const { text } = await supertest(BASE_URL).post('/input').send(transaction).expect(406)
    const response = JSON.parse(text)
    assert.deepEqual(response, invalidData('transaction'))
  })

  test('Has transaction history: Account 1', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount1.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transactionHistory).expect(200)
    const response = JSON.parse(text)
    assert.isArray(response.result)
    assert.lengthOf(response.result, 1)
  })

  test('Has transaction history: Account 2', async (assert) => {
    const transactionHistory = mockGetTransactionHistory(acount2.payload.document)
    const { text } = await supertest(BASE_URL).post('/input').send(transactionHistory).expect(200)
    const response = JSON.parse(text)
    assert.isArray(response.result)
    assert.lengthOf(response.result, 1)
  })

  test('If transaction history with invalid Data', async (assert) => {
    const transactionHistory: any = mockGetTransactionHistory(acount1.payload.document)
    delete transactionHistory.payload.document
    const { text } = await supertest(BASE_URL).post('/input').send(transactionHistory).expect(406)
    const response = JSON.parse(text)
    assert.deepEqual(response, invalidData('transaction_history'))
  })
})
