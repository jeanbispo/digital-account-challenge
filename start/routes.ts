import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'Hello world from a slim app'
})

Route.resource('accounts', 'AccountsController').only(['index', 'store', 'show'])
Route.resource('account-limits', 'AccountLimitsController').only(['index', 'show'])
Route.resource('transactions', 'TransactionsController').only(['index', 'store', 'show'])
Route.get('transactions/history/:document', 'TransactionsController.history')
Route.post('input', 'InputController.input')
