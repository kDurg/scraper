var router = require ("express").Router();
var articleCont = require("../../controllers/article");

router.get("/all", articleCont.findAll);
router.get("/scrape", articleCont.scrape);
router.get("/clear", articleCont.clear);
router.get("/:id", articleCont.findOne);

router.put("/:id", articleCont.update);

router.delete("/:id", articleCont.deleteOne);

module.exports = route;