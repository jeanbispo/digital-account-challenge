class TransactionHistorySctruct {
  private uuid: string
  private status: string
  private senderDocument: string
  private receiverDocument: string
  private value: number
  private datetime: string
  private availableLimit: number

  constructor() {}

  public getUUID() {
    return this.uuid
  }

  public setUUID(uuid: string): TransactionHistorySctruct {
    this.uuid = uuid
    return this
  }

  public getStatus() {
    return this.status
  }

  public setStatus(status: string): TransactionHistorySctruct {
    this.status = status
    return this
  }

  public getSenderDocument() {
    return this.senderDocument
  }

  public setSenderDocument(senderDocument: string): TransactionHistorySctruct {
    this.senderDocument = senderDocument
    return this
  }

  public getReceiverDocument() {
    return this.receiverDocument
  }

  public setReceiverDocument(receiverDocument: string): TransactionHistorySctruct {
    this.receiverDocument = receiverDocument
    return this
  }

  public getValue() {
    return this.value
  }

  public setValue(value: number): TransactionHistorySctruct {
    this.value = value
    return this
  }

  public getDatetime() {
    return this.datetime
  }

  public setDatetime(datetime: string): TransactionHistorySctruct {
    this.datetime = datetime
    return this
  }

  public getAvailableLimit() {
    return this.availableLimit
  }

  public setAvailableLimit(availableLimit: number): TransactionHistorySctruct {
    this.availableLimit = availableLimit
    return this
  }

  public getData() {
    return {
      uuid: this.uuid,
      status: this.status,
      senderDocument: this.senderDocument,
      receiverDocument: this.receiverDocument,
      value: this.value,
      datetime: this.datetime,
      availableLimit: this.availableLimit,
    }
  }
}
