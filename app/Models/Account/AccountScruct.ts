import AccountLimitHistoryScruct from 'App/Models/AccountLimitHistory/AccountLimitHistoryScruct'

export default class AccountStruct extends AccountLimitHistoryScruct {
  private _name: string
  private _document: string
  private _accountStructUUID: string

  constructor() {
    super()
  }

  public get name() {
    return this._name
  }

  public set name(name: string) {
    this._name = name
  }

  public get document() {
    return this._document
  }

  public set document(document: string) {
    this._document = document
  }

  public get UUID() {
    return this._accountStructUUID
  }

  public set UUID(uuid: string) {
    this._accountStructUUID = uuid
    this.accountUUID = uuid
  }

  public getAccountData() {
    return {
      name: this._name,
      document: this._document,
      uuid: this._accountStructUUID,
    }
  }
}
