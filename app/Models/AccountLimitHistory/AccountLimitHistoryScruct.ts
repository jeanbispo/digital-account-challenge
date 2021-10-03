import { v4 as uuidv4 } from 'uuid'

export default class AccountLimitHistoryScruct {
  private _accountLimitHistoryScructUUID: string
  private _accountUUID: string
  private _availableLimit: number
  private _timestamp: number
  private _validated: boolean

  constructor() {
    this._accountLimitHistoryScructUUID = uuidv4()
  }

  public get accountLimitHistoryScructUUID() {
    return this._accountLimitHistoryScructUUID
  }

  public set accountLimitHistoryScructUUID(uuid: string) {
    this._accountLimitHistoryScructUUID = uuid
  }

  public get accountUUID() {
    return this._accountUUID
  }

  public set accountUUID(uuid: string) {
    this._accountUUID = uuid
  }

  public get availableLimit() {
    return this._availableLimit
  }

  public set availableLimit(availableLimit: number) {
    this._availableLimit = availableLimit
  }

  public get timestamp() {
    return this._timestamp
  }

  public set timestamp(timestamp: number) {
    this._timestamp = timestamp
  }

  public get validated() {
    return this._validated
  }

  public set validated(validated: boolean) {
    this._validated = validated
  }

  public getAccountLimitHistoryData() {
    return {
      uuid: this._accountLimitHistoryScructUUID,
      accountUUID: this._accountUUID,
      availableLimit: this._availableLimit,
      validated: this._validated,
      timestamp: this._timestamp,
    }
  }
}
