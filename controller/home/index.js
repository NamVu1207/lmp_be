var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const home = require("./Home");

router.post("/listcity", home.getListCityOfHouses);
router.post("/listhouse", home.getHouseByCity);
router.post("/getroom", home.getRoom);
router.post("/booking", home.booking);

module.exports = router;
