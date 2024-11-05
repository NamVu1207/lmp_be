const moment = require("moment-timezone");
const { db } = require("../../config/database");
const houseModel = require("../../model/houseModel");

const getHouse = async (req, res, next) => {
  const city = req.body.city;
  const result = await houseModel.getHouse(city);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const listEmployee = async (req, res, next) => {
  const result = await houseModel.getListEmployee();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const houseId = Number(data.id);
      const item = {
        house_name: data.house_name,
        house_address: data.house_address,
        manager: Number(data.manager),
        floors: Number(data.floors),
        rooms: Number(data.rooms),
        district: data.district,
        city: data.city,
        ward: data.ward,
      };
      const result = await houseModel.save(houseId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteHouse = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await houseModel.deleteHouse(data);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  getHouse,
  listEmployee,
  save,
  deleteHouse,
};
