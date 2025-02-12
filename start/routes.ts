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
  return response.redirect().toRoute('loginHomePage')
})

router
  .get('/home', async ({ view }) => {
    return view.render('pages/home')
  })
  .as('home')

router
  .get('/login', async ({ view }) => {
    return view.render('pages/login/login')
  })
  .as('login')
router
  .get('/loginHomePage', async ({ view }) => {
    return view.render('pages/login/loginHomePage')
  })
  .as('loginHomePage')
router
  .get('/inscription', async ({ view }) => {
    return view.render('pages/login/inscription')
  })
  .as('inscription')
router.post('/inscription', async ({ view }) => {}).as('postInscription')
//router.get('/', [DecksController, 'index']).as('home')
