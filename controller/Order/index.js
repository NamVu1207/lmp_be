var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const order = require("./Order");

router.post("/save", auth, order.save);
router.post("/load", auth, order.getService);
router.post("/confirm", auth, order.confirm);
router.post("/changepass", auth, order.changePassword);

module.exports = router;
