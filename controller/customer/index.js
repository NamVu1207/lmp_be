var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const cus = require("./customer");

router.post("/listhouse", auth, cus.listHouse);
router.post("/listroom", auth, cus.listRoom);
router.post("/roomvalid", auth, cus.roomValid);
router.post("/save", auth, cus.save);
router.post("/load", auth, cus.getCustomer);
router.post("/delete", auth, cus.deleteCustomer);

module.exports = router;
