var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");
var PORT = 3000;
var app = express();



app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

var router = require("./controllers/api.js");
app.use(router);

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI); // Heroku deployment


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`);
});