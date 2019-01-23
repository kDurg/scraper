var router = require ("express").Router();
var noteCont = require("../../controllers/note");

router.get("/all", noteCont.findAll);
router.get("/:id", noteCont.findOne);

router.post("/", noteCont.create);

router.delete("/:id", noteCont.delete);

router.put("/:id", noteCont.update);

module.exports = router;