var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = {
    findAll: function (req, res) {
        db.Article.find()
            .then(function(articles) {
                res.json(articles);
            });
    },
    findOne: function (req, res) {
        db.Article.findById(req.params.id)
            .populate("note")
            .then(function(article){
                res.json(articles);
            });
    },
    deleteOne: function (req, res) { // Correct????
        db.Article.deleteOne({_id: req.params.id})
        .then(function(article) {
            res.json(article);
        });
    },
    update: function(req,res) {
        db.Article.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(function(article) {
            res.json(article);
        });
    },
    scrape: function(req, res) {
        axios.get("https://www.nytimes.com/").then(function(response) {
            var $ = cheerio.load(response.data);
            $("h2.title").each(function(i, element) {
                var article = {};
                article.title = $(element).text();
                article.link = $(element).parent().attr("href");
                db.Article.create(article);
            });
        });
        res.send("Scraping the internet has finished");
    },
    clear: function (req, res) {
        db.Article.deleteMany({})
        .then (function(article) {
            return db.Note.deleteMany({});
        }).then(function () {
            res.send("All notes and articles have been cleared");
        });
    }
}