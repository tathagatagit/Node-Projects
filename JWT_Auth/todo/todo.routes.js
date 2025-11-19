const express = require("express");
const { createToDoo, getToDoo, updateToDoo, deleteToDoo } = require("./todo.controllers");
const { checkAuth } = require("../auth/auth.controllers");
const routes = express.Router();

routes.post("/create", checkAuth, createToDoo);
routes.get("/list", checkAuth, getToDoo);
routes.post("/update/:id", checkAuth, updateToDoo);
routes.get("/delete/:id", checkAuth, deleteToDoo);

module.exports = {
    todoRoutes: routes
}
