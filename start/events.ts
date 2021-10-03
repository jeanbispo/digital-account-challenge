import Event from '@ioc:Adonis/Core/Event'
import { confirmTransaction, ItransactionEventPayload } from 'App/Services/TransactionsService'

Event.on('transaction', async (payload: ItransactionEventPayload) => {
  await confirmTransaction(payload)
})
