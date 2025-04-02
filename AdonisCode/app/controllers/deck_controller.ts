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
        session.flash('error', 'Vous avez déjà un deck avec ce nom')
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

  async createCard({ params, view, session }: HttpContext) {
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

      // Check for duplicate question
      const existingCard = await Card.query()
        .where('deck_id', deck.id)
        .where('question', question)
        .first()

      if (existingCard) {
        session.flash('error', 'Une carte avec cette question existe déjà dans ce deck')
        return response.redirect().back()
      }

      const card = await Card.create({
        question,
        answer,
        deckId: deck.id
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
    const card = await Card.findOrFail(params.cardId)
    const deckId = card.deckId
    await card.delete()
    return response.redirect().toRoute('deck.show', { id: deckId })
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

      await Database.transaction(async (trx) => {
        // Delete all cards in the deck
        await Card.query({ client: trx })
          .where('deck_id', deck.id)
          .delete()

        // Delete the deck
        await deck.delete()
      })

      session.flash('success', 'Deck supprimé avec succès!')
      return response.redirect().toRoute('decks.index')
    } catch (error) {
      console.error('Error deleting deck:', error)
      session.flash('error', 'Une erreur est survenue lors de la suppression du deck')
      return response.redirect().back()
    }
  }
}
