import * as faker from 'faker'

export const mockStoreTransaction = (senderDocument: string, receiverDocument: string) => ({
  type: 'transaction',
  payload: {
    'sender-document': senderDocument,
    'receiver-document': receiverDocument,
    'value': 300,
    'datetime': new Date().toISOString(),
  },
})
