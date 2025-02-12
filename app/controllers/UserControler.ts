import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator } from '../Validator/validator.js'
import User from '#models/user'

/**
 * Controller pour l'authentification
 */
export default class AuthController {
  async handleRegister({ request, auth, session, response }: HttpContext) {
    // Valide les données envoyées
    const payload = await request.validateUsing(registerUserValidator)

    // Crée un nouvel utilisateur
    const user = await User.create({
      username: payload.username,
      password: payload.password,
    })

    // Connecte automatiquement l'utilisateur après l'inscription
    await auth.use('web').login(user)

    // Ajoute un message flash de succès
    session.flash('success', "L'utilisateur a été inscrit avec succès")

    // Redirige vers la page d'accueil
    return response.redirect().toRoute('home')
  }
}
