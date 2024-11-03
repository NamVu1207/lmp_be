var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const rentalfee = require("./rentalfee");

router.post("/listhouse", auth, rentalfee.listHouse);
router.post("/listroom", auth, rentalfee.listRoom);
router.post("/load", auth, rentalfee.load);
router.post("/delete", auth, rentalfee.deleteBill);
router.post("/loadbill", auth, rentalfee.getBill);
router.post("/submitbill", auth, rentalfee.submitBill);

module.exports = router;
