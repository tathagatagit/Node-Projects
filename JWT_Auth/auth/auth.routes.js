const express = require("express");
const { registerUser, loginUser, getUser, checkAuth } = require("./auth.controllers");
const routes = express.Router();

routes.post("/signup", registerUser);
routes.post("/login", loginUser);
routes.get("/list", checkAuth, getUser);


module.exports = {
    userRoutes: routes
};
