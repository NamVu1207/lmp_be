var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const booking = require("./booking");

router.post("/listhouse", auth, booking.listHouse);
router.post("/listroom", auth, booking.listRoom);
router.post("/roomvalid", auth, booking.roomValid);
router.post("/addbooking", auth, booking.addBooking);
router.post("/getbooking", auth, booking.getBooking);
router.post("/deletebooking", auth, booking.deleteBooking);

module.exports = router;
