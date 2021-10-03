export const mockGetTransactionHistory = (document: string) => ({
  type: 'transaction_history',
  payload: {
    document: document,
  },
})
