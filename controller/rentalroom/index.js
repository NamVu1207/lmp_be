var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");
const { db } = require("../../config/database");
const room = require("./room");

router.post("/getroom", auth, room.GetRoom);
router.post("/addhouse", auth, room.AddHouse);
router.post("/addroom", auth, room.AddRoom);
router.post("/deleteroom", auth, room.DeleteRoom);
router.post("/deletehouse", auth, room.DeleteHouse);
router.post("/addcontract", auth, room.AddContract);
router.post("/cancelrent", auth, room.CancelRent);

module.exports = router;
