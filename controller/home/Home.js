const moment = require("moment-timezone");
const { db } = require("../../config/database");
const homeModel = require("../../model/homeModel");

const { notificationToManagers } = require("../../service/socketServer");

const getListCityOfHouses = async (req, res, next) => {
  const result = await homeModel.GetListCity();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getHouseByCity = async (req, res, next) => {
  const city = req.body.city;
  const result = await homeModel.GetHousebyCity(city);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};
const getRoom = async (req, res, next) => {
  const houseId = req.body.houseId;
  const result = await homeModel.GetRoom(houseId);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};
const booking = async (req, res, next) => {
  const data = req.body.data;
  const item = {
    room_id: Number(data.room_id),
    cus_name: data.cus_name,
    cus_phone: data.cus_phone,
    price: Number(data.price),
    booking_date: moment().format("YYYY-MM-DD"),
    target_date: moment(data.target_date).format("YYYY-MM-DD"),
  };
  const result = await homeModel.Booking(item);
  if (result.success)
    notificationToManagers(
      JSON.stringify({
        success: result.success,
        title: `New booking`,
        message: `Có khách booking phòng ${result.roomName}`,
      })
    );
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

module.exports = { getListCityOfHouses, getHouseByCity, getRoom, booking };
