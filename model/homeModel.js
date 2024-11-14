const { db } = require("../config/database");
const moment = require("moment-timezone");

const GetListCity = async () => {
  const query = db("house as h")
    .distinct("h.city")
    .where("h.house_status", true);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const GetHousebyCity = async (city = "") => {
  if (!city) return [];
  const query = db("house as h")
    .distinct("h.*", "emp.employee_name", "emp.phone")
    .leftJoin("room as r", "r.house_id", "h.id")
    .leftJoin("employee as emp", "emp.id", "h.manager")
    .where("h.city", city)
    .where("h.house_status", true)
    .where("r.room_status", true)
    .where("r.is_rented", "available");
  let result = await query.catch((err) => console.log(err));
  return result;
};

const GetRoom = async (houseId = "") => {
  const query = db("room as r")
    .select("r.*")
    .where("r.house_id", houseId)
    .where("r.room_status", true)
    .where("r.is_rented", "available");
  let result = await query.catch((err) => console.log(err));
  return result;
};

const Booking = async (item = {}) => {
  console.log(item);
  const house = await db("room")
    .select("house_id")
    .where("id", item.room_id)
    .where("is_rented", "available");
  console.log(house);
  if (house.length === 0)
    return { success: false, message: "Phòng đã được booking" };
  const result = await db("booking")
    .insert({
      ...item,
      house_id: house[0].house_id,
    })
    .returning("room_id ")
    .catch((err) => console.log(err));
  if (result.length > 0) {
    const roomName = await db("room")
      .where("id", result[0].room_id)
      .update({ is_rented: "booking" })
      .returning("room_name")
      .catch((err) => console.log(err));
    return {
      success: true,
      message: "Booking thành công",
      roomName: roomName[0].room_name,
    };
  } else return { success: false, message: "Booking thất bại" };
};

module.exports = { GetListCity, GetHousebyCity, GetRoom, Booking };
