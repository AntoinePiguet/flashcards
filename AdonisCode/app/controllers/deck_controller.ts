import type { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'
import Card from '#models/card'
import Database from '@adonisjs/lucid/services/db'

export default class DeckController {
  async index({ view, auth }: HttpContext) {
    const decks = await Deck.query()
      .where('user_id', auth.user!.id)
      .preload('cards')
      .orderBy('created_at', 'desc')

    return view.render('pages/deck/index', { decks })
  }

  async create({ view, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return view.render('pages/login/login')
    }

    return view.render('pages/deck/create', {
      user,
      error: null,
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    try {
      const name = request.input('name')?.trim()
      const description = request.input('description')?.trim()

      // Validate name
      if (!name) {
        session.flash('error', 'Le nom du deck ne peut pas être vide')
        return response.redirect().back()
      }

      // Validate description length
      if (!description || description.length < 10) {
        session.flash('error', 'La description doit contenir au moins 10 caractères')
        return response.redirect().back()
      }

      // Check for duplicate title
      const existingDeck = await Deck.query()
        .where('user_id', auth.user!.id)
        .where('name', name)
        .first()

      if (existingDeck) {
        session.flash('error', 'Vous avez déjà un deck avec ce nom. Veuillez en choisir un autre.')
        return response.redirect().back()
      }

      const deck = new Deck()
      deck.name = name
      deck.description = description
      deck.userId = auth.user!.id
      await deck.save()

      session.flash('success', 'Deck créé avec succès!')
      return response.redirect(`/decks/${deck.id}/cards/new`)
    } catch (error) {
      console.error('Error creating deck:', error)
      session.flash('error', 'Une erreur est survenue lors de la création du deck')
      return response.redirect().back()
    }
  }

  async show({ params, view, response }: HttpContext) {
    // If the ID is 'create', redirect to the create page
    if (params.id === 'create') {
      return response.redirect().toRoute('decks.create')
    }

    try {
      const deck = await Deck.query().where('id', params.id).preload('cards').first()

      if (!deck) {
        return response.redirect().toRoute('decks.index')
      }

      return view.render('pages/deck/show', { deck })
    } catch (error) {
      console.error('Error in show method:', error)
      return response.redirect().toRoute('decks.index')
    }
  }

  async createCard({ params, view, session, response }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      const cards = await Card.query()
        .where('deck_id', deck.id)
        .select(['id', 'question'])
        .orderBy('created_at', 'desc')
      return view.render('pages/card/new', { deck, cards })
    } catch (error) {
      console.error('Error in createCard:', error)
      session.flash('error', 'Une erreur est survenue')
      return response.redirect().back()
    }
  }

  async storeCard({ request, response, params, session }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      const question = request.input('question', '').trim()
      const answer = request.input('answer', '').trim()

      // Validate question length
      if (question.length < 10) {
        session.flash('error', 'La question doit contenir au moins 10 caractères')
        return response.redirect().back()
      }

      // Validate answer
      if (!answer) {
        session.flash('error', 'La réponse ne peut pas être vide')
        return response.redirect().back()
      }

      // Check for duplicate question
      const existingCard = await Card.query()
        .where('deck_id', deck.id)
        .where('question', question)
        .first()

      if (existingCard) {
        session.flash(
          'error',
          'Une carte avec cette question existe déjà dans ce deck. Veuillez en choisir une autre.'
        )
        return response.redirect().back()
      }

      await Card.create({
        question,
        answer,
        deckId: deck.id,
      })

      session.flash('success', 'Carte créée avec succès!')
      return response.redirect().toRoute('deck.show', { id: deck.id })
    } catch (error) {
      console.error('Error in storeCard:', error)
      session.flash('error', 'Une erreur est survenue lors de la création de la carte')
      return response.redirect().back()
    }
  }
  async showCard({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.cardId)
    await card.load('deck')
    return view.render('pages/card/show', { card })
  }

  async deleteCard({ params, response, session }: HttpContext) {
    try {
      const card = await Card.findOrFail(params.cardId)
      const deckId = card.deckId
      await card.delete()
      session.flash('success', 'Carte supprimée avec succès!')
      return response.redirect().toRoute('deck.show', { id: deckId })
    } catch (error) {
      console.error('Error deleting card:', error)
      session.flash('error', 'Une erreur est survenue lors de la suppression de la carte')
      return response.redirect().back()
    }
  }

  async editCard({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.cardId)
    await card.load('deck')
    return view.render('pages/card/edit', { card })
  }

  async updateCard({ request, response, params, session }: HttpContext) {
    try {
      const card = await Card.findOrFail(params.cardId)
      const question = request.input('question', '').trim()
      const answer = request.input('answer', '').trim()

      // Validate question length
      if (question.length < 10) {
        session.flash('error', 'La question doit contenir au moins 10 caractères')
        return response.redirect().back()
      }

      // Check for duplicate question (excluding current card)
      const existingCard = await Card.query()
        .where('deck_id', card.deckId)
        .where('question', question)
        .whereNot('id', card.id)
        .first()

      if (existingCard) {
        session.flash('error', 'Une carte avec cette question existe déjà dans ce deck')
        return response.redirect().back()
      }

      card.merge({ question, answer })
      await card.save()

      session.flash('success', 'Carte modifiée avec succès!')
      return response.redirect().toRoute('deck.show', { id: card.deckId })
    } catch (error) {
      console.error('Error in updateCard:', error)
      session.flash('error', 'Une erreur est survenue lors de la modification de la carte')
      return response.redirect().back()
    }
  }

  async edit({ params, view, auth, response }: HttpContext) {
    try {
      const deck = await Deck.query()
        .where('id', params.id)
        .where('user_id', auth.user!.id)
        .firstOrFail()

      return view.render('pages/deck/edit', { deck })
    } catch (error) {
      return response.redirect().toRoute('decks.index')
    }
  }
  async update({ params, request, response, auth, session }: HttpContext) {
    try {
      const deck = await Deck.query()
        .where('id', params.id)
        .where('user_id', auth.user!.id)
        .firstOrFail()

      const name = request.input('name')?.trim()
      const description = request.input('description')?.trim()

      // Validate name
      if (!name) {
        session.flash('error', 'Le nom du deck ne peut pas être vide')
        return response.redirect().back()
      }

      // Validate description length
      if (!description || description.length < 10) {
        session.flash('error', 'La description doit contenir au moins 10 caractères')
        return response.redirect().back()
      }

      // Check for duplicate title (excluding current deck)
      const existingDeck = await Deck.query()
        .where('user_id', auth.user!.id)
        .where('name', name)
        .whereNot('id', deck.id)
        .first()

      if (existingDeck) {
        session.flash('error', 'Vous avez déjà un deck avec ce nom')
        return response.redirect().back()
      }

      deck.merge({ name, description })
      await deck.save()

      session.flash('success', 'Deck modifié avec succès!')
      return response.redirect().toRoute('deck.show', { id: deck.id })
    } catch (error) {
      console.error('Error updating deck:', error)
      session.flash('error', 'Une erreur est survenue lors de la modification du deck')
      return response.redirect().back()
    }
  }

  async delete({ params, response, auth, session }: HttpContext) {
    try {
      const deck = await Deck.query()
        .where('id', params.id)
        .where('user_id', auth.user!.id)
        .firstOrFail()

      // Désactiver temporairement les contraintes de clé étrangère
      await Database.rawQuery('SET FOREIGN_KEY_CHECKS = 0')

      try {
        // Supprimer d'abord toutes les cartes
        await Card.query().where('deck_id', deck.id).delete()

        // Puis supprimer le deck
        await deck.delete()

        session.flash('success', 'Deck supprimé avec succès!')
      } finally {
        // Réactiver les contraintes de clé étrangère
        await Database.rawQuery('SET FOREIGN_KEY_CHECKS = 1')
      }

      return response.redirect().toRoute('decks.index')
    } catch (error) {
      console.error('Error deleting deck:', error)
      session.flash('error', 'Une erreur est survenue lors de la suppression du deck')
      return response.redirect().back()
    }
  }

  async startExercise({ params, view, session, response }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      await deck.load('cards')

      if (deck.cards.length === 0) {
        session.flash(
          'error',
          "Ce deck ne contient pas de cartes. Ajoutez des cartes avant de commencer l'exercice."
        )
        return response.redirect().toRoute('deck.show', { id: deck.id })
      }

      return view.render('pages/exercise/start', { deck })
    } catch (error) {
      console.error('Error starting exercise:', error)
      session.flash('error', "Une erreur est survenue lors du démarrage de l'exercice")
      return response.redirect().back()
    }
  }

  public async showExerciseCard({ params, view, session, response }: HttpContext) {
    console.log('showExerciseCard: Received params:', params)

    const deckId = params.id
    const cardId = params.cardId
    const requestedMode = params.mode
    console.log('showExerciseCard: Requested mode from params:', requestedMode)

    console.log('showExerciseCard: Attempting to find deck with ID:', deckId)
    const deck = await Deck.find(deckId)
    console.log('showExerciseCard: Deck find result:', deck ? 'Found' : 'Not Found')

    if (!deck) {
      session.flash('error', 'Deck non trouvé.')
      return response.redirect().back()
    }

    console.log('showExerciseCard: Attempting to load cards for deck:', deckId)
    await deck.load('cards')
    console.log('showExerciseCard: Cards loaded. Number of cards:', deck.cards.length)

    console.log('showExerciseCard: Attempting to find card with ID:', cardId, ' within deck cards.')
    const card = deck.cards.find((c) => c.id === cardId)
    console.log('showExerciseCard: Card find result:', card ? 'Found' : 'Not Found')

    if (!card) {
      session.flash('error', 'Carte non trouvée.')
      return response.redirect().back()
    }

    // S'assurer que la carte appartient bien au deck
    if (card.deckId !== deck.id) {
      session.flash('error', "Cette carte n'appartient pas à ce deck.")
      return response.redirect().back()
    }

    // Always use the requested mode from the URL as the current exercise mode for this card view
    const exerciseMode = requestedMode
    console.log('showExerciseCard: Setting current exercise mode to requested mode:', exerciseMode)

    // Update the mode in session to reflect the current card's mode
    session.put('exercise_mode', exerciseMode)
    console.log('showExerciseCard: Exercise mode stored in session:', session.get('exercise_mode'))

    // If it's the timed mode ('2') and this is the first card being loaded for this mode, set the start time in session
    const firstCardId = deck.cards[0]?.id
    // Check if exercise data exists to determine if an exercise is already ongoing
    const exerciseData = session.get('exercise_data', {})

    // Logic to start timer only if it's the first card of a *new* timed exercise session
    if (exerciseMode === '2' && cardId === firstCardId && Object.keys(exerciseData).length === 0) {
      console.log(
        'showExerciseCard: Timed mode on first card with no existing exercise data. Setting start time.'
      )
      session.put('exercise_start_time', Date.now())
    }

    console.log('showExerciseCard: Final mode passed to view:', exerciseMode)
    console.log(
      'showExerciseCard: Start time in session before rendering view:',
      session.get('exercise_start_time')
    )

    // Pass the determined exercise mode to the view as a string
    return view.render('pages/exercise/card', {
      deck,
      card,
      exerciseModeValue: String(exerciseMode),
    })
  }

  async submitAnswer({ params, request, response, session }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      const card = await Card.findOrFail(params.cardId)
      const userAnswer = request.input('answer', '').trim().toLowerCase()
      const correctAnswer = card.answer.trim().toLowerCase()

      // Stocker la réponse dans la session
      const answers = session.get('exercise_answers', {})
      answers[card.id] = userAnswer === correctAnswer
      session.put('exercise_answers', answers)

      // Trouver la prochaine carte
      const nextCard = await Card.query()
        .where('deck_id', deck.id)
        .where('id', '>', card.id)
        .orderBy('id', 'asc')
        .first()

      if (nextCard) {
        return response
          .redirect()
          .toRoute('deck.exercise.card', { id: deck.id, cardId: nextCard.id })
      } else {
        return response.redirect().toRoute('deck.exercise.finish', { id: deck.id })
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      session.flash('error', 'Une erreur est survenue lors de la soumission de la réponse')
      return response.redirect().back()
    }
  }

  public async finishExercise({ params, view, session, response }: HttpContext) {
    const deckId = params.id
    const deck = await Deck.find(deckId)

    if (!deck) {
      session.flash('error', 'Deck non trouvé.')
      return response.redirect().back()
    }

    const exerciseData = session.get('exercise_data', {})
    const correctAnswers = Object.values(exerciseData).filter((isCorrect) => isCorrect).length
    const totalCards = deck.cards.length
    const score = totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0

    // Récupérer le mode et le temps écoulé si mode chronométré
    const mode = session.get('exercise_mode')
    let elapsedTime = null
    if (mode === '2') {
      const startTime = session.get('exercise_start_time')
      if (startTime) {
        elapsedTime = Date.now() - startTime // Temps écoulé en millisecondes
      }
    }

    // Nettoyer la session
    session.forget('exercise_data')
    session.forget('exercise_mode')
    session.forget('exercise_start_time')

    return view.render('pages/exercise/finish', {
      deck,
      score,
      correctAnswers,
      totalCards,
      elapsedTime,
      mode,
    })
  }
}
