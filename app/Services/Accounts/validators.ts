import { schema } from '@ioc:Adonis/Core/Validator'

export const newAccountValidator = schema.create({
  type: schema.string({ trim: true }),
  payload: schema.object().members({
    'name': schema.string(),
    'document': schema.string(),
    'available-limit': schema.number(),
  }),
})
