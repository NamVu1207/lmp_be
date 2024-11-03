var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const serv = require("./service");

router.post("/listhouse", auth, serv.listHouse);
router.post("/save", auth, serv.save);
router.post("/load", auth, serv.getService);
router.post("/delete", auth, serv.deleteService);

module.exports = router;
