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

  async startExercise({ params, view, session }: HttpContext) {
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

  async showExerciseCard({ params, view, session }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      const card = await Card.findOrFail(params.cardId)

      if (card.deckId !== deck.id) {
        session.flash('error', "Cette carte n'appartient pas à ce deck")
        return response.redirect().toRoute('deck.show', { id: deck.id })
      }

      return view.render('pages/exercise/card', { deck, card })
    } catch (error) {
      console.error('Error showing exercise card:', error)
      session.flash('error', "Une erreur est survenue lors de l'affichage de la carte")
      return response.redirect().back()
    }
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

  async finishExercise({ params, view, session }: HttpContext) {
    try {
      const deck = await Deck.findOrFail(params.id)
      const answers = session.get('exercise_answers', {})

      // Calculer les statistiques
      const totalCards = Object.keys(answers).length
      const correctAnswers = Object.values(answers).filter(Boolean).length
      const score = Math.round((correctAnswers / totalCards) * 100)

      // Nettoyer la session
      session.forget('exercise_answers')

      return view.render('pages/exercise/finish', {
        deck,
        score,
        totalCards,
        correctAnswers,
      })
    } catch (error) {
      console.error('Error finishing exercise:', error)
      session.flash('error', "Une erreur est survenue lors de la fin de l'exercice")
      return response.redirect().toRoute('deck.show', { id: params.id })
    }
  }
}
