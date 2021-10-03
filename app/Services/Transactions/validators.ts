import { schema } from '@ioc:Adonis/Core/Validator'

export const newTransactionValidator = schema.create({
  type: schema.string({ trim: true }),
  payload: schema.object().members({
    'sender-document': schema.string(),
    'receiver-document': schema.string(),
    'value': schema.number(),
    'datetime': schema.string(),
  }),
})

export const showHistoryValidator = schema.create({
  type: schema.string({ trim: true }),
  payload: schema.object().members({
    document: schema.string(),
  }),
})
