var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const other = require("./otherfee");

router.post("/save", auth, other.save);
router.post("/load", auth, other.load);
router.post("/listhouse", auth, other.listHouse);
router.post("/delete", auth, other.deleteOtherfee);

module.exports = router;
