const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const bookingModel = require("../../model/bookingModel");

const listRoom = async (req, res, next) => {
  const result = await ewModel.GetListRoom();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const listHouse = async (req, res, next) => {
    const result = await bookingModel.GetListHouse();
    res.status(200).json({ status: 200, success: true, data: result });
    return;
  };

module.exports = {listRoom, listHouse};
