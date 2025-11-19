const express = require("express");
const dotenv = require("dotenv");
const { userRoutes } = require("./auth/auth.routes");
const { todoRoutes } = require("./todo/todo.routes");
dotenv.config({path: "./.env", quiet: true});
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/auth", userRoutes);
app.use("/todo", todoRoutes);

app.use((err, req, res, next) => {
    res.json({message: err.message});
});


app.listen(port, (err) => {
    if(err)     console.log(`Server not running ${err.message}`);
    else        console.log(`Server running on ${port}...`);
});










