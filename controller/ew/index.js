var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const ew = require("./ew");

router.post("/listhouse", auth, ew.listHouse);
router.post("/listroom", auth, ew.listRoom);
router.post("/getew", auth, ew.getEw);
router.post("/deleteEw", auth, ew.deleteEw);
router.post("/addew", auth, ew.AddEw);

module.exports = router;
