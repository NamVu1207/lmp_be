var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const dashboard = require("./dashboard");

router.post("/roomcount", auth, dashboard.countRoomByStatus);
router.post("/expenses", auth, dashboard.getExpenses);
router.post("/booking", auth, dashboard.getBooking);

module.exports = router;
