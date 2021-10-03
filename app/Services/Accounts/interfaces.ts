export interface IstoreAccountBody {
  type: string
  payload: {
    'name': string
    'document': string
    'available-limit': number
  }
}

export interface IstoreAccountParsedResponse {
  'name': string
  'document': string
  'available-limit': number
}
