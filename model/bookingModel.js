const { db } = require("../config/database");
const moment = require("moment-timezone");

const CheckRoom = async (houseId, roomName) => {
  const result = await db("room")
    .select("id")
    .where("house_id", houseId)
    .andWhere("room_name", roomName)
    .andWhere("is_rented", "available");
  return result;
};

const DeleteBooking = async (item = {}) => {
  const id = await db("booking")
    .where("id", item.id)
    .del()
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    await db("room")
      .where("id", item.room_id)
      .update({ is_rented: "available" })
      .catch((err) => console.log(err));
  }
  return id;
};

const GetBooking = async (house_id, fromDate, toDate) => {
  const query = db("booking as b")
    .select("b.*", "h.house_name", "r.room_name")
    .leftJoin("house as h", "b.house_id", "h.id")
    .leftJoin("room as r", "b.room_id", "r.id")
    .where("h.house_status", true)
    .where("r.room_status", true);
  if (house_id) query.where("b.house_id", house_id);
  if (fromDate) query.where("b.booking_date", ">=", fromDate);
  if (toDate) query.where("b.booking_date", "<=", toDate);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const AddBooking = async (bookingId, item = {}) => {
  const existBooking = await db("booking").select("id").where("id", bookingId);
  if (existBooking.length > 0) {
    const idUpdBooking = await db("booking")
      .where("id", bookingId)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (idUpdBooking.length > 0) {
      await db("room")
        .where("id", item.room_id)
        .update({ is_rented: item.booking_status ? "booking" : "available" })
        .catch((err) => console.log(err));
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const idNewBooking = await db("booking")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (idNewBooking.length > 0) {
      await db("room")
        .where("id", item.room_id)
        .update({ is_rented: item.booking_status ? "booking" : "available" })
        .catch((err) => console.log(err));
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

module.exports = { CheckRoom, AddBooking, GetBooking, DeleteBooking };
