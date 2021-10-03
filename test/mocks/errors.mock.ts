export const invalidData = (type) => ({
  type,
  status: 'failure',
  violation: 'invalid_data',
})

export const doubleTransaction = (type) => ({
  type,
  status: 'failure',
  violation: 'double_transaction',
})

export const accountAlreadyInitialized = (type) => ({
  type,
  status: 'failure',
  violation: 'account_already_initialized',
})
