var router = require ("express").Router();
var db = require("../../models");

router.get("/", function (req, res) {
    db.Article.find({saved:false})
    .then(function(articles){
        res.render("articles", {articles});
    });
});

router.get("/saved", function (req,res) {
    db.Article.find({saved:true})
    .then(function(articles){
        res.render("saved articles", {articles});
    });
});

module.exports = router;