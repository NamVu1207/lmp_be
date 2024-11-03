const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");
const lrModel = require("../../model/listroomModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getServ = async (req, res, next) => {
  const result = await lrModel.GetService();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getRoomServ = async (req, res, next) => {
  const result = await lrModel.GetRoomService();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getRoom = async (req, res, next) => {
  let { room_name = "", house_id = "", cus_info = "" } = req.body;
  const result = await lrModel.GetRoom(room_name, house_id, cus_info);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let listRow = req.body.listRow;
  let listDetail = req.body.listDetail;
  let outputs = {};
  let arr_msg = [];
  if (listRow.length > 0) {
    for await (let data of listRow) {
      const roomId = Number(data.id);
      const item = {
        room_name: data.room_name,
        capacity: Number(data.capacity),
        floor: Number(data.floor),
        area: Number(data.area),
        price: Number(data.price),
        note: data.note,
        is_rented: data.is_rented,
      };
      const result = await lrModel.save(roomId, item);
      arr_msg.push(result);
    }
  }
  if (listDetail.length > 0) {
    for await (let data of listDetail) {
      const id = Number(data.id);
      const item = {
        room_id: Number(data.room_id),
        service_id: Number(data.service_id),
        amount: Number(data.amount),
        active: data.active,
      };
      const result = await lrModel.saveRoomServ(id, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteRS = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await lrModel.deleteRS(data);
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
  getRoom,
  getServ,
  deleteRS,
  getRoomServ,
};
