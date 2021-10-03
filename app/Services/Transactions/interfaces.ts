export interface IlaunchTransactionPayload {
  senderUUID: string
  receiverUUID: string
  value: number
  datetime: number
}

export interface IcreateNewAccountsLimitsPayload {
  accountUUID: string
  availableLimit: number
  lastTransactionUUID: string
}

export interface ItransactionEventPayload {
  transaction: any
  senderAccountLimit: any
  receiverAccountLimit: any
}

export interface IstoreTransactionBody {
  type: string
  payload: {
    'sender-document': string
    'receiver-document': string
    'value': number
    'datetime': string
  }
}

export interface IstoreTransactionParsedResponse {
  'available-limit': number
  'receiver-document': string
  'sender-document': string
  'datetime': string
}

export interface ItransactionHistoryBody {
  type: string
  payload: {
    document: string
  }
}
