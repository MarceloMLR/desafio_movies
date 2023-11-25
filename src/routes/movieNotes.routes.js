const {Router} = require("express");

const movieNotesRoutes = Router();

const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotesController = new MovieNotesController();

movieNotesRoutes.post('/:user_id',  movieNotesController.create)
movieNotesRoutes.put('/:user_id/:note_id',  movieNotesController.update)
movieNotesRoutes.delete("/:id", movieNotesController.delete)

module.exports = movieNotesRoutes