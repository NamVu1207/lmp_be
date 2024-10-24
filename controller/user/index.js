var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");

const user = require("./user");

router.post("/listusers", auth, user.listuser);
router.post("/saveuser", auth, user.saveuser);
router.post("/deleteuser", auth, user.deleteuser);
router.post("/departments", auth, user.GetListDepartment);
router.post("/groups", auth, user.GetListGroups);

module.exports = router;
