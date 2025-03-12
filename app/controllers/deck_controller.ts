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
      console.log('Starting deck creation...')

      // Get form data
      const name = request.input('name')
      const description = request.input('description')

      console.log('Form data:', { name, description })
      console.log('User ID:', auth.user!.id)

      // Validate name
      if (!name || !name.trim()) {
        session.flash('error', 'Le nom du deck ne peut pas être vide')
        return response.redirect().back()
      }

      // Check for duplicate deck name for the same user
      const existingDeck = await Database.rawQuery(
        'SELECT * FROM decks WHERE user_id = ? AND name = ?',
        [auth.user!.id, name]
      )

      if (existingDeck.length > 0) {
        session.flash('error', 'Vous avez déjà un deck avec ce nom')
        return response.redirect().back()
      }

      console.log('Creating deck...')

      // Insert deck using raw SQL
      const [result] = await Database.rawQuery(
        'INSERT INTO decks (name, description, user_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, description || '', auth.user!.id]
      )

      const deckId = result.insertId
      console.log('Deck created with ID:', deckId)

      // Verify the deck was created
      const [deck] = await Database.rawQuery('SELECT * FROM decks WHERE id = ?', [deckId])

      if (!deck) {
        throw new Error('Deck was not created successfully')
      }

      // Set success message
      session.flash('success', 'Deck créé avec succès!')

      // Redirect to card creation using direct URL
      return response.redirect(`/decks/${deckId}/cards/new`)
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

  async createCard({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/card/new', { deck })
  }

  async storeCard({ request, response, params, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    const payload = request.only(['question', 'answer'])

    // Validate question length
    if (payload.question.length < 10) {
      session.flash('error', 'La question doit contenir au moins 10 caractères')
      return response.redirect().back()
    }

    // Check for empty answer
    if (!payload.answer.trim()) {
      session.flash('error', 'La réponse ne peut pas être vide')
      return response.redirect().back()
    }

    // Check for duplicate question
    const existingCard = await Card.query()
      .where('deck_id', deck.id)
      .where('question', payload.question)
      .first()

    if (existingCard) {
      session.flash('error', 'Cette question existe déjà dans le deck')
      return response.redirect().back()
    }

    await Card.create({
      ...payload,
      deckId: deck.id,
    })

    return response.redirect().toRoute('deck.show', { id: deck.id })
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
    const card = await Card.findOrFail(params.cardId)
    const payload = request.only(['question', 'answer'])

    // Validate question length
    if (payload.question.length < 10) {
      session.flash('error', 'La question doit contenir au moins 10 caractères')
      return response.redirect().back()
    }

    // Check for empty answer
    if (!payload.answer.trim()) {
      session.flash('error', 'La réponse ne peut pas être vide')
      return response.redirect().back()
    }

    // Check for duplicate question (excluding current card)
    const existingCard = await Card.query()
      .where('deck_id', card.deckId)
      .where('question', payload.question)
      .whereNot('id', card.id)
      .first()

    if (existingCard) {
      session.flash('error', 'Cette question existe déjà dans le deck')
      return response.redirect().back()
    }

    await card.merge(payload).save()
    return response.redirect().toRoute('deck.show', { id: card.deckId })
  }
}
