const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const otherModel = require("../../model/otherfeeModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const load = async (req, res, next) => {
  let { house_id = "" } = req.body;
  const result = await otherModel.load(house_id);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const otherId = Number(data.id);
      const item = {
        house_id: Number(data.house_id),
        category: data.category,
        price: Number(data.price),
        amount: Number(data.amount),
        detail: data.detail,
      };
      const result = await otherModel.save(otherId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteOtherfee = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await otherModel.deleteOtherfee(data);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  save,
  load,
  listHouse,
  deleteOtherfee,
};
