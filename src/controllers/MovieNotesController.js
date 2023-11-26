const sqliteConnection = require('../database/sqlite')
const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class MovieNotesController {
    async create(request, response) {
        const {title, description, rating, tags} = request.body;
        const {user_id} = request.params;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const tagsInsert = tags.map(name => {
            return {
                
                note_id,
                user_id,
                name
            }
        });

        console.log(tagsInsert)

        await knex("movie_tags").insert(tagsInsert)

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

    async index(request, response) {
        const {user_id, title, tags} = request.query;

        let movieNotes;

        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())

            movieNotes = await knex("movie_tags").select([
                "movieNotes.id",
                "movieNotes.title",
                "movieNotes.user_id",
            ])
            .where("movieNotes.user_id", user_id)
            .whereLike("movieNotes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movieNotes.id", "tags.note_id")
            .orderBy("title")
        }
        else if (title) {
        
            movieNotes =  await knex("movie_notes").where({user_id}).whereLike("title", `%${title}%`).orderBy("created_at")
        
        }
        
        else { 
            movieNotes =  await knex("movie_notes").where({user_id}).orderBy("created_at")
        };

        const userTags = await knex("movie_tags").where({user_id});
        const notesWithTags = movieNotes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);
            return {
                ...note,
                tags:noteTags
            }
        })

        return response.json(notesWithTags);
    }


}

module.exports = MovieNotesController