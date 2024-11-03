var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const lr = require("./listroom");

router.post("/listhouse", auth, lr.listHouse);
router.post("/listserv", auth, lr.getServ);
router.post("/save", auth, lr.save);
router.post("/load", auth, lr.getRoom);
router.post("/loadrs", auth, lr.getRoomServ);
router.post("/delete", auth, lr.deleteRS);

module.exports = router;
