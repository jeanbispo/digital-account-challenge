import { IstoreAccountBody } from 'App/Services/Accounts/interfaces'
import * as faker from 'faker'

export const mockStoreAccount = (): IstoreAccountBody => ({
  type: 'initialize_account',
  payload: {
    'name': faker.name.findName(),
    'document': faker.finance.account(),
    'available-limit': Number(faker.finance.mask()),
  },
})
