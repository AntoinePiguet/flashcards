import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator, loginUserValidator } from '../Validator/validator.js'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

interface ValidationError {
  messages: Record<string, string[]>
}

export default class AuthController {
  async handleLogin({ request, auth, response, session }: HttpContext) {
    try {
      console.log('Starting login process...')
      const payload = await request.validateUsing(loginUserValidator)
      console.log('Validation passed:', payload)

      try {
        console.log('Attempting authentication...')
        // Find the user
        const user = await User.findBy('username', payload.username)
        if (!user) {
          session.flash({ error: "Nom d'utilisateur ou mot de passe incorrect." })
          return response.redirect().back()
        }

        // Verify password
        const isValid = await hash.verify(user.password, payload.password)
        if (!isValid) {
          session.flash({ error: "Nom d'utilisateur ou mot de passe incorrect." })
          return response.redirect().back()
        }

        // Login user
        await auth.use('web').login(user)
        console.log('Authentication successful')
        return response.redirect().toRoute('home')
      } catch (error) {
        console.error('Authentication failed:', error)
        session.flash({ error: "Nom d'utilisateur ou mot de passe incorrect." })
        return response.redirect().back()
      }
    } catch (error) {
      console.error('Validation failed:', error)
      session.flash({ error: 'Veuillez remplir tous les champs.' })
      return response.redirect().back()
    }
  }

  async handleRegister({ request, auth, response, session }: HttpContext) {
    try {
      // Valide les données envoyées
      const payload = await request.validateUsing(registerUserValidator)

      // Hash the password before creating the user
      const hashedPassword = await hash.make(payload.password)

      // Create the user with hashed password
      const user = await User.create({
        username: payload.username,
        password: hashedPassword,
      })

      // Connecte automatiquement l'utilisateur après l'inscription
      await auth.use('web').login(user)

      // Redirige vers la page d'accueil après succès
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)

      // Gestion spécifique des erreurs de validation
      const validationError = error as ValidationError
      if (validationError.messages) {
        const errorMessages = Object.values(validationError.messages)
        if (errorMessages.length > 0 && errorMessages[0].length > 0) {
          const errorMessage = errorMessages[0][0]
          if (errorMessage.toLowerCase().includes('unique')) {
            session.flash({ error: "Ce nom d'utilisateur est déjà pris." })
          } else {
            session.flash({ error: errorMessage })
          }
        } else {
          session.flash({ error: "Une erreur est survenue lors de l'inscription." })
        }
      } else {
        session.flash({ error: "Une erreur est survenue lors de l'inscription." })
      }

      return response.redirect().back()
    }
  }
}
