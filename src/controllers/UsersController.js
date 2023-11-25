const { hash, compare } = require('bcryptjs')
const sqliteConnection = require('../database/sqlite')
const AppError = require("../utils/AppError")

class UsersController {
    async create(request, response) {

      /* console.log(request) */
      const { name, email, password } = request.body

      const database = await sqliteConnection()
      const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
  
      if (checkUserExists){
        throw new AppError("Este e-mail já está em uso.")
      }
  
      const hashedPassword = await hash(password, 8)
  
      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      )
  
      return response.status(201).json()
    }
}



module.exports = UsersController