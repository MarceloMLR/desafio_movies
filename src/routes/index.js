const router = require('express');

const usersRoutes = require("./users.routes")

const routes = router();



routes.use('/users', usersRoutes);


module.exports = routes;