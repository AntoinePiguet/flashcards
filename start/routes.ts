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

// Routes pour les utilisateurs non connectés
router.get('/', async ({ response }) => {
  return response.redirect('/home')
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
  .use(middleware.guest())

router
  .post('/login', [AuthController, 'handleLogin'])
  .as('auth.handleLogin')
  .use(middleware.guest())

router
  .get('/inscription', async ({ view }) => {
    return view.render('pages/login/inscription')
  })
  .as('inscription')
  .use(middleware.guest())

router
  .post('/inscription', [AuthController, 'handleRegister'])
  .as('auth.handleRegister')
  .use(middleware.guest())

//route pour accéder à la page d'erreur
router
  .get('/erreur', async ({ view, session }) => {
    return view.render('pages/login/loginError', { error: session.flashMessages.get('error') })
  })
  .as('erreur')

// Route de déconnexion
router
  .post('/logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  })
  .as('logout')
  .use(middleware.auth())

//router.get('/', [DecksController, 'index']).as('home')
