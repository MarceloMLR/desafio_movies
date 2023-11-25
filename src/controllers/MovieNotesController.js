const sqliteConnection = require('../database/sqlite')
const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class MovieNotesController {
    async create(request, response) {
        const {title, description, rating} = request.body;
        const {user_id} = request.params;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        return response.json()
    }

    async update (request, response) {
        const {title, description, rating} = request.body;
        const {user_id, note_id} = request.params;

        const database = await sqliteConnection()

        const note = await database.get("SELECT * FROM movie_notes WHERE id = (?) AND user_id = (?)", [note_id, user_id]) 

        if (!note) {
            throw new AppError("A nota não existe")
        }

        note.title ?? note.title
        note.description ?? note.title
        note.rating ?? note.rating

       database.run(`
        UPDATE movie_notes SET
        title = (?),
        description = (?),
        rating = (?),
        updated_at = DATETIME('now')
        WHERE id = (?)
        AND user_id = (?)
        `,
        [
            title,
            description,
            rating,
            note_id,
            user_id

        ])


        return response.json()
    }

    async delete(request, response) {
        const {id} = request.params;

        await knex("movie_notes").where({id}).delete();

        return response.json();
    }


}

module.exports = MovieNotesController