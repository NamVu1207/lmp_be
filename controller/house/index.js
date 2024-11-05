var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const house = require("./house");

router.post("/load", auth, house.getHouse);
router.post("/employee", auth, house.listEmployee);
router.post("/save", auth, house.save);
router.post("/delete", auth, house.deleteHouse);

module.exports = router;
