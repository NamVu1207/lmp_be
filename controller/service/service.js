const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const servModel = require("../../model/servModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getService = async (req, res, next) => {
  let { serv_name = "", house_id = "" } = req.body;
  const result = await servModel.GetService(serv_name, house_id);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const serviceId = Number(data.id);
      const item = {
        serv_name: data.serv_name,
        price: Number(data.price),
        house_id: Number(data.house_id),
        active: data.active,
        note: data.note,
      };
      const result = await servModel.save(serviceId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteService = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await servModel.deleteService(data);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  listHouse,
  save,
  getService,
  deleteService,
};
