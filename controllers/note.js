var db = require("../models");

module.exports = {
    findAll: function(req,res) {
        db.Note.find()
        .then(function(notes){
            res.json(notes);
        });
    },
    findOne: function(req,res) {
        db.Note.findById(req.params.id)
        .then(function(note){
            res.json(note);
        });
    },
    create: function(req,res) {
        db.Note.create({ text: req.body.text})
        .then(function(note) {
            return db.Article.findOneAndUpdate({ _id: req.body.articleID}, {text: note}) // Note sure about the text part
        })
        .then(function(article) {
            res.json(article);
        })
    },
    update: function(req, res) {
        db.Note.findOneAndUpdate({_id: req.params.id }, {$set: {text: req.body.text}})
        .then(function(note) {
            res.json(note);
        })
    },
    delete: function (req, res) { //OK?
        db.Note.deleteOne({_id: req.params.id}, res.body)
        .then (function(note) {
            res.json(note)
        });
    }
}