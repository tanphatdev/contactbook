//Import thư viện Express
const express = require("express");
// Imporrt thư viện CORS
const cors = require("cors");
const res = require("express/lib/response");
const setupContactRoutes = require("./app/routes/contact.routes");
const { BadRequestError, errorHandler } = require("./app/errors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.get("/", (req,res) => {
    res.json({message: "Welcome to contact book application."});
});

setupContactRoutes(app);

app.use((req, res, next) => {
    next(new BadRequestError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    errorHandler.handleError(err, res);
});

module.exports = app;