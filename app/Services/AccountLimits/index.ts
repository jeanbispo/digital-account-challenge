import AccountLimitHistoryStorage from 'App/Models/AccountLimitHistory/AccountLimitHistoryStorage'

export const indexService = async () => await AccountLimitHistoryStorage.getList()

export const showService = async (uuid: string) =>
  await AccountLimitHistoryStorage.getAccountLimitHistoryByField(uuid, 'uuid')
