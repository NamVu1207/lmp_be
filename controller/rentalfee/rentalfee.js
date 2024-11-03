const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const rfModel = require("../../model/rentalfeeModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const listRoom = async (req, res, next) => {
  const result = await ewModel.GetListRoom();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getBill = async (req, res, next) => {
  let { room_name = "", house_id = "", month = "" } = req.body;
  const result = await rfModel.getBill(room_name, house_id, month);
  res.status(200).json({ status: 200, ...result });
  return;
};

const submitBill = async (req, res, next) => {
  let billInfo = req.body.data;
  const result = await rfModel.submitBill(billInfo);
  res.status(200).json({ status: 200, ...result });
  return;
};

const load = async (req, res, next) => {
  let { serv_name = "", house_id = "" } = req.body;
  const result = await rfModel.load(serv_name, house_id);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const deleteBill = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await rfModel.deleteBill(data);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  listHouse,
  listRoom,
  load,
  getBill,
  deleteBill,
  submitBill,
};
