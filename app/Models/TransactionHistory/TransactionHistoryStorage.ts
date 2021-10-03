interface ItransactionStorage {
  uuid: string
  senderUUID: string
  receiverUUID: string
  value: number
  datetime: number
  confirmed: boolean
}

export default abstract class TransactionHistoryStorage {
  private static list: any = []

  public static async getList(): Promise<Array<ItransactionStorage>> {
    return TransactionHistoryStorage.list
  }

  public static getTransactionByField(valueToSearch: string, field: string) {
    const searchResult = TransactionHistoryStorage.list.find(
      (_account: ItransactionStorage) => _account[field] === valueToSearch
    )

    return searchResult || {}
  }

  public static getTransactionListByUUID(uuid: string) {
    const searchResult = TransactionHistoryStorage.list.filter(
      (_account: ItransactionStorage) =>
        _account.senderUUID === uuid || _account.receiverUUID === uuid
    )

    return searchResult || {}
  }

  public static addToList(account: ItransactionStorage) {
    TransactionHistoryStorage.list.push(account)
    return this
  }

  public static changeTransactionByUUID(UUID: string, newData: ItransactionStorage) {
    const index = TransactionHistoryStorage.list.findIndex(
      (transaction) => transaction.uuid === UUID
    )
    if (index !== -1) TransactionHistoryStorage.list[index] = newData
    return this
  }
}
