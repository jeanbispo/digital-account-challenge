import AccountLimitHistoryStorage from '../AccountLimitHistory/AccountLimitHistoryStorage'

interface Iaccount {
  name: string
  document: string
  uuid: string
}

export default abstract class AccountStorage {
  private static list: any = []

  public static async getList() {
    return await Promise.all(
      AccountStorage.list.map(async (account) => ({
        ...account,
        'available-limit':
          (
            await AccountLimitHistoryStorage.getAccountLastValidLimitByField(account.uuid, 'uuid')
          )?.availableLimit || 0,
      }))
    )
  }

  public static getAccountByField(valueToSearch: string, field: string) {
    const searchResult = AccountStorage.list.find(
      (_account: any) => _account[field] === valueToSearch
    )

    return searchResult || {}
  }

  public static addToList(account: Iaccount) {
    AccountStorage.list.push(account)
    return this
  }
}
