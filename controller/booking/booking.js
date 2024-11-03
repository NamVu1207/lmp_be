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
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const roomValid = async (req, res, next) => {
  const houseId = req.body.house_id;
  const roomName = req.body.room_name;
  const result = await bookingModel.CheckRoom(houseId, roomName);
  if (result.length > 0)
    res.status(200).json({ status: 200, success: true, data: result[0] });
  else res.status(200).json({ status: 200, success: false, data: result[0] });
  return;
};

const getBooking = async (req, res, next) => {
  let { date = "", house_id = "" } = req.body;
  let fromDate = "";
  let toDate = "";
  if (date.length > 0) {
    fromDate = date[0];
    toDate = date[1];
  }
  const result = await bookingModel.GetBooking(house_id, fromDate, toDate);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const addBooking = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const bookingId = data.id;
      const item = {
        house_id: Number(data.house_id),
        room_id: Number(data.room_id),
        cus_name: data.cus_name,
        cus_phone: data.cus_phone,
        price: Number(data.price),
        booking_status: data.booking_status,
        booking_date: moment(data.booking_date).format("YYYY-MM-DD"),
        target_date: moment(data.target_date).format("YYYY-MM-DD"),
        note: data.note,
      };
      const result = await bookingModel.AddBooking(bookingId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteBooking = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await bookingModel.DeleteBooking(data);
          if (result.length > 0)
            arr_msg.push({
              status: true,
              mess: `Xóa thành công`,
            });
          else
            arr_msg.push({
              status: false,
              mess: `Xóa không thành công`,
            });
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  listRoom,
  listHouse,
  roomValid,
  addBooking,
  getBooking,
  deleteBooking,
};
