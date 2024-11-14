const { db } = require("../config/database");
const moment = require("moment-timezone");

const getService = async (status, cus_name) => {
  const query = db("history_order as ho")
    .select(
      "ho.*",
      "h.house_name",
      "r.room_name",
      "cus.cus_name",
      "serv.serv_name"
    )
    .leftJoin("house as h", "h.id", "ho.house_id")
    .leftJoin("room as r", "r.id", "ho.room_id")
    .leftJoin("customer as cus", "cus.id", "ho.customer_id")
    .leftJoin("services as serv", "serv.id", "ho.service_id");
  if (status) query.where("ho.order_status", status);
  if (cus_name) query.where("cus.cus_name", "like", `%${cus_name}%`);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const save = async (item) => {
  const id = await db("history_order")
    .insert({ ...item, created_at: moment().format("YYYY-MM-DD") })
    .returning("room_id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    const roomName = await db("room")
      .select("room_name")
      .where("id", id[0].room_id);
    return {
      success: true,
      message: "Thêm mới thành công",
      roomName: roomName[0].room_name,
    };
  } else return { success: false, message: "Thêm mới thất bại" };
};

const confirm = async (item = {}, type = "") => {
  let id = [];
  const status =
    type === "processing"
      ? "confirmed"
      : type === "confirmed"
      ? "done"
      : "deleted";
  const currentStatus = await db("history_order")
    .select("order_status")
    .where("id", item.id)
    .catch((err) => console.log(err));
  if (status === "done") {
    if (currentStatus[0].order_status === "confirmed") {
      id = await db("history_order")
        .where("id", item.id)
        .update({
          order_status: status,
        })
        .returning("id")
        .catch((err) => console.log(err));
    }
  } else {
    if (currentStatus[0].order_status === "processing") {
      const updateData = {
        order_status: status,
      };
      if (status === "deleted") {
        updateData.cancelled_at = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      id = await db("history_order")
        .where("id", item.id)
        .update(updateData)
        .returning("id")
        .catch((err) => console.log(err));
    }
  }
  if (id.length > 0) {
    return { success: true, message: "Xác nhận thành công" };
  } else return { success: false, message: "Xác nhận thất bại" };
};

module.exports = { getService, save, confirm };
