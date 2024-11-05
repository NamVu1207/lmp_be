var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const staff = require("./Staff");

router.post("/save", auth, staff.save);
router.post("/load", auth, staff.getStaff);
router.post("/delete", auth, staff.deleteStaff);

module.exports = router;
