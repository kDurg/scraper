var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request"); 
var cheerio = require("cheerio");
 

router.get("/scrape", (req, res) => {
    console.log("scrape finished")
    request("https://www.nytimes.com/", (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body);
            var count = 0;
            // grab articles
            $('article').each(function (i, element) {
                // Save an empty object
                var count = i;
                var result = {};
                result.title = $(element)
                    .children('.story-heading')
                    .children('a')
                    .text().trim();
                result.link = $(element)
                    .children('.story-heading')
                    .children('a')
                    .attr("href");
                result.summary = $(element)
                    .children('.summary')
                    .text().trim()
                    || $(element)
                        .children('ul')
                        .text().trim();
                result.byline = $(element)
                    .children('.byline')
                    .text().trim()
                
                if (result.title && result.link && result.summary){
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            count++;
                        })
                        .catch(function (err) {
                            return res.json(err);
                        });
                };
            });
            res.redirect('/')
        }
        else if (error || response.statusCode != 200){
            res.send("Error: Can not scrape")
        }
    });
});

router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            var retrievedArticles = dbArticle;
            var hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
            var hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });;
});

router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles/:id", function (req, res) {
    db.Article.find({ _id: req.params.id })
        .populate({
            path: 'note',
            model: 'Note'
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/note/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.delete("/note/:id", function (req, res) {
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;