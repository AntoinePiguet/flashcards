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
import AuthController from '#controllers/UserControler'
import { middleware } from './kernel.js'
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

// Route permettant d'afficher le formulaire d'inscription (si nécessaire)
router
  .get('/inscription', async ({ view }) => {
    return view.render('pages/login/inscription')
  })
  .as('inscription')

// Route permettant l'inscription d'un utilisateur
router
  .post('/inscription', [AuthController, 'handleRegister'])
  .as('auth.handleRegister')
  .use(middleware.guest())

//router.get('/', [DecksController, 'index']).as('home')
