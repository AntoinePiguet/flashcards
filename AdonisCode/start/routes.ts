/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/UserControler'
import { middleware } from './kernel.js'
import DeckController from '#controllers/deck_controller'

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

// Route pour accéder à la page d'erreur
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

// Deck routes
router
  .group(() => {
    // Deck routes
    router.get('/decks/create', [DeckController, 'create']).as('decks.create')
    router.post('/decks', [DeckController, 'store']).as('decks.store')
    router.get('/decks', [DeckController, 'index']).as('decks.index')
    router.get('/decks/:id', [DeckController, 'show']).as('deck.show')
    router.get('/decks/:id/edit', [DeckController, 'edit']).as('deck.edit')
    router.post('/decks/:id/update', [DeckController, 'update']).as('deck.update')
    router.post('/decks/:id/delete', [DeckController, 'delete']).as('deck.delete')

    // Card routes
    router.get('/decks/:id/cards/new', [DeckController, 'createCard']).as('deck.cards.create')
    router.post('/decks/:id/cards', [DeckController, 'storeCard']).as('deck.cards.store')
    router.get('/decks/:id/cards/:cardId', [DeckController, 'showCard']).as('deck.cards.show')
    router.get('/decks/:id/cards/:cardId/edit', [DeckController, 'editCard']).as('deck.cards.edit')
    router
      .post('/decks/:id/cards/:cardId/update', [DeckController, 'updateCard'])
      .as('deck.cards.update')
    router
      .post('/decks/:id/cards/:cardId/delete', [DeckController, 'deleteCard'])
      .as('deck.cards.delete')

    // Exercise routes
    router.get('/decks/:id/exercise', [DeckController, 'startExercise']).as('deck.exercise.start')
    router
      .get('/decks/:id/exercise/:mode/:cardId', [DeckController, 'showExerciseCard'])
      .as('deck.exercise.card')
    router
      .post('/decks/:id/exercise/card/:cardId/answer', [DeckController, 'submitAnswer'])
      .as('deck.exercise.answer')
    router
      .get('/decks/:id/exercise/finish', [DeckController, 'finishExercise'])
      .as('deck.exercise.finish')
  })
  .middleware([middleware.auth()])
