/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import DecksController from '#controllers/decks_controller'

import router from '@adonisjs/core/services/router'
router.get('/', async ({ response }) => {
  return response.redirect().toRoute('home')
})

router
  .get('/home', async ({ view }) => {
    return view.render('pages/home')
  })
  .as('home')

router
  .get('/login', async ({ view }) => {
    return view.render('pages/login')
  })
  .as('login')

//router.get('/', [DecksController, 'index']).as('home')
