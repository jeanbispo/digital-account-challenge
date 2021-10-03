import Event from '@ioc:Adonis/Core/Event'
import { confirmTransaction } from 'App/Services/Transactions'
import { ItransactionEventPayload } from 'App/Services/Transactions/interfaces'

Event.on('transaction', async (payload: ItransactionEventPayload) => {
  await confirmTransaction(payload)
})
