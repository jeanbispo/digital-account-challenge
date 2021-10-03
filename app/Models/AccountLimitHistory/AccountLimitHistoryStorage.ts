interface IaccountLimitStorage {
  uuid: string
  accountUUID: string
  availableLimit: number
  validated: boolean
  timestamp: number
}

export default abstract class AccountLimitHistoryStorage {
  private static list: Array<any> = []

  public static getList() {
    return AccountLimitHistoryStorage.list
  }

  public static async getAccountLimitHistoryByField(valueToSearch: string, field: string) {
    const searchResult = await Promise.all(
      AccountLimitHistoryStorage.list.filter(
        async (_account: any) => _account[field] === valueToSearch
      )
    )

    return searchResult || {}
  }

  private static async getLastValidAccountLimit(accountLimitHistoric) {
    return accountLimitHistoric.reduce(({ timestamp: a }, { timestamp: b }) => Math.max(a, b)) || {}
  }

  public static async getAccountLastValidLimitByField(
    valueToSearch: string,
    field: string
  ): Promise<any> {
    let searchResult = await Promise.all(
      AccountLimitHistoryStorage.list.filter(
        async (_account: any) => _account[field] === valueToSearch && _account.validated
      )
    )
    if (searchResult.length)
      return await AccountLimitHistoryStorage.getLastValidAccountLimit(searchResult)
    return {}
  }

  public static addToList(account: IaccountLimitStorage) {
    AccountLimitHistoryStorage.list.push(account)
    return this
  }
}
