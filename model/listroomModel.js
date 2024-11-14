const { db } = require("../config/database");
const moment = require("moment-timezone");

const GetService = async () => {
  const query = db("services")
    .select("house_id", "id", "serv_name", "price", "unit")
    .where("service_type", "fixed")
    .where("active", true);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const GetRoomService = async () => {
  const query = db("room_service").select("*").where("active", true);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const GetRoom = async (room_name, house_id, cus_info) => {
  const query = db("room as r")
    .select(
      "r.*",
      "h.house_name",
      "cus.cus_name",
      "cus.cccd",
      db.raw(
        "COUNT(CASE WHEN cc.contract_id = cont.id THEN 1 END) AS current_capacity"
      )
    )
    .leftJoin("house as h", "r.house_id", "h.id")
    .leftJoin("contracts as cont", function () {
      this.on("r.id", "cont.room_id").on(db.raw("cont.contract_status = true"));
    })
    .leftJoin("contract_cus as cc", "cont.id", "cc.contract_id")
    .leftJoin("customer as cus", "cont.customer_id", "cus.id")
    .where("h.house_status", true)
    .where("r.room_status", true)
    .groupBy("r.id", "h.house_name", "cont.id", "cus.cccd", "cus.cus_name")
    .orderBy("r.id", "asc");
  if (house_id) query.where("r.house_id", house_id);
  if (room_name) query.where("r.room_name", "like", `%${room_name}%`);
  if (cus_info)
    query.where(function () {
      this.where("cus.cus_name", "like", `%${cus_info}%`).orWhere(
        "cus.cccd",
        "like",
        `%${cus_info}%`
      );
    });
  let result = await query.catch((err) => console.log(err));
  return result;
};

const deleteRS = async (item = {}) => {
  const id = await db("room_service")
    .where("id", item.id)
    .del()
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    return { success: true, message: "Xóa thành công" };
  } else return { success: false, message: "Xóa thất bại" };
};

const save = async (roomId, item = {}) => {
  const existRoom = await db("room").select("id").where("id", roomId);
  if (existRoom.length > 0) {
    const id = await db("room")
      .where("id", roomId)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  }
};

const saveRoomServ = async (rsid, item = {}) => {
  const existItem = await db("room_service").select("id").where("id", rsid);
  if (existItem.length > 0) {
    const id = await db("room_service")
      .where("id", rsid)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const id = await db("room_service")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

module.exports = {
  GetRoom,
  GetService,
  save,
  saveRoomServ,
  GetRoomService,
  deleteRS,
};
