export interface IlaunchTransactionPayload {
  senderUUID: string
  receiverUUID: string
  value: number
  datetime: number
}

export interface IcreateNewAccountsLimitsPayload {
  accountUUID: string
  availableLimit: number
}

export interface ItransactionEventPayload {
  transaction: any
  senderAccountLimit: any
  receiverAccountLimit: any
}