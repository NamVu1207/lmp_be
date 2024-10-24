var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const booking = require("./booking");

router.post("/listhouse", auth, booking.listHouse);
router.post("/listroom", auth, booking.listRoom);

module.exports = router;
