const moment = require("moment-timezone");
const { db } = require("../../config/database");
const roomModel = require("../../model/roomModel");

const GetRoom = async (req, res, next) => {
  let { is_rented = "", room_name = "" } = req.body;
  const result = await roomModel.GetRoom(room_name, is_rented);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const AddHouse = async (req, res, next) => {
  let datas = req.body;
  let result;
  if (datas.length) {
    for await (let data of datas) {
      result = await roomModel.AddHouse(data);
    }
  }
  if (result.length > 0)
    res
      .status(200)
      .json({ status: 200, success: true, message: "thêm mới thành công" });
  else
    res
      .status(200)
      .json({ status: 200, success: false, message: "thêm mới thất bại" });

  return;
};

const AddRoom = async (req, res, next) => {
  let datas = req.body;
  let result;
  if (datas.length) {
    result = await roomModel.AddRoom(datas[0]);
  }
  if (result.length > 0)
    res
      .status(200)
      .json({ status: 200, success: true, message: "thêm mới thành công" });
  else
    res
      .status(200)
      .json({ status: 200, success: false, message: "thêm mới thất bại" });

  return;
};

const DeleteRoom = async (req, res, next) => {
  const id = req.body.data;
  let result;
  if (id > 0) {
    result = await roomModel.DeleteRoom(id);
  }
  if (result.length > 0)
    res
      .status(200)
      .json({ status: 200, success: true, message: "xóa thành công" });
  else
    res
      .status(200)
      .json({ status: 200, success: false, message: "xóa thất bại" });
  return;
};

const DeleteHouse = async (req, res, next) => {
  const id = req.body.data;
  let result;
  if (id > 0) {
    result = await roomModel.DeleteHouse(id);
  }
  if (result.length > 0)
    res
      .status(200)
      .json({ status: 200, success: true, message: "xóa thành công" });
  else
    res
      .status(200)
      .json({ status: 200, success: false, message: "xóa thất bại" });
  return;
};

const AddContract = async (req, res, next) => {
  const renter = req.body.renter;
  const contract = req.body.contract;
  const result = await roomModel.AddContract(renter, contract);
  if (result.length > 0)
    res
      .status(200)
      .json({ status: 200, success: true, message: "đã tạo hợp đồng" });
  else
    res
      .status(200)
      .json({ status: 200, success: false, message: "tạo hợp đồng thất bại" });
  return;
};

const CancelRent = async (req, res, next) => {
  const id = req.body.data;
  const result = await roomModel.CancelRent(id);
  if (result.length > 0) res.status(200).json({ status: 200, ...result });
  else res.status(200).json({ status: 200, ...result });
  return;
};

module.exports = {
  GetRoom,
  AddHouse,
  AddRoom,
  DeleteRoom,
  AddContract,
  CancelRent,
  DeleteHouse,
};
