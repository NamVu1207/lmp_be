const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const cusModel = require("../../model/customerModel");

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

const roomValid = async (req, res, next) => {
  const houseId = req.body.house_id;
  const roomName = req.body.room_name;
  const result = await cusModel.CheckRoom(houseId, roomName);
  if (result.length > 0)
    res.status(200).json({ status: 200, success: true, data: result[0] });
  else res.status(200).json({ status: 200, success: false, data: result[0] });
  return;
};

const getCustomer = async (req, res, next) => {
  let { contractActive = "", cus_info = "", house_id = "" } = req.body;
  const result = await cusModel.GetCustomer(cus_info, house_id, contractActive);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const customerId = Number(data.id);
      const contractId = data.contract_id;
      const item = {
        cus_name: data.cus_name,
        gender: data.gender,
        phone: data.phone,
        birthday: moment(data.birthday).format("YYYY-MM-DD"),
        email: data.email,
        cccd: data.cccd,
        password: data?.password ? data.password : "123456",
        cus_address: data.cus_address,
      };
      const result = await cusModel.save(customerId, contractId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteCustomer = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await cusModel.DeleteCustomer(data);
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
  roomValid,
  getCustomer,
  deleteCustomer,
  save,
};
