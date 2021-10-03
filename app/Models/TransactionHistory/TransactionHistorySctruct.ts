export default class TransactionHistorySctruct {
  private _uuid: string
  private _confirmed: boolean
  private _senderUUID: string
  private _receiverUUID: string
  private _value: number
  private _datetime: number

  constructor() {}

  public get UUID() {
    return this._uuid
  }

  public set UUID(uuid: string) {
    this._uuid = uuid
  }

  public get confirmed() {
    return this._confirmed
  }

  public set confirmed(confirmed: boolean) {
    this._confirmed = confirmed
  }

  public get senderUUID() {
    return this._senderUUID
  }

  public set senderUUID(senderUUID: string) {
    this._senderUUID = senderUUID
  }

  public get receiverUUID() {
    return this._receiverUUID
  }

  public set receiverUUID(receiverUUID: string) {
    this._receiverUUID = receiverUUID
  }

  public get value() {
    return this._value
  }

  public set value(value: number) {
    this._value = value
  }

  public get datetime() {
    return this._datetime
  }

  public set datetime(datetime: number) {
    this._datetime = datetime
  }

  public getTransactionData() {
    return {
      uuid: this._uuid,
      senderUUID: this._senderUUID,
      receiverUUID: this._receiverUUID,
      value: this._value,
      datetime: this._datetime,
      confirmed: this._confirmed,
    }
  }
}
