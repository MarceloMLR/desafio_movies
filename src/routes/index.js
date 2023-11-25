const router = require('express');

const usersRoutes = require("./users.routes")
const moviesNotesRoutes = require("./movieNotes.routes")

const routes = router();

routes.use('/users', usersRoutes);
routes.use('/movies_notes', moviesNotesRoutes);


module.exports = routes;