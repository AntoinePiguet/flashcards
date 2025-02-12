import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'
export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        isAdmin: true,
        username: 'Antoine',
        password: 'Administrator',
        createdAt: DateTime.now(),
        updatedAt: null,
        id: 1,
      },
      {
        isAdmin: false,
        username: 'User1',
        password: 'password1',
        createdAt: DateTime.now(),
        updatedAt: null,
        //pas besoin de spécifier les id car elles sont autoincrément
        //id: 2,
      },
      {
        isAdmin: false,
        username: 'User2',
        password: 'password2',
        createdAt: DateTime.now(),
        updatedAt: null,
        //id: 3,
      },
      {
        isAdmin: false,
        username: 'User3',
        password: 'password3',
        createdAt: DateTime.now(),
        updatedAt: null,
      },
    ])
  }
}
