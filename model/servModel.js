const { db } = require("../config/database");
const moment = require("moment-timezone");

const GetService = async (serv_name, house_id) => {
  const query = db("services as serv")
    .select("serv.*", "h.house_name")
    .leftJoin("house as h", "serv.house_id", "h.id")
    .where("h.house_status", true);
  if (house_id) query.where("serv.house_id", house_id);
  if (serv_name) query.where("serv.serv_name", "like", `%${serv_name}%`);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const deleteService = async (item = {}) => {
  const existService = await db("room_service")
    .select("id")
    .where("service_id", item.id)
    .limit(1);
  if (existService.length > 0) {
    await db("room_service")
      .where("service_id", item.id)
      .del()
      .catch((err) => console.log(err));
  }
  const id = await db("services")
    .where("id", item.id)
    .del()
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    return { success: true, message: "Xóa thành công" };
  } else return { success: false, message: "Xóa thất bại" };
};

const save = async (serviceId, item = {}) => {
  const existService = await db("services").select("id").where("id", serviceId);
  if (existService.length > 0) {
    const id = await db("services")
      .where("id", serviceId)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      await db("room_service")
        .where("service_id", serviceId)
        .update({ active: item.active })
        .catch((err) => console.log(err));
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const id = await db("services")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

module.exports = { save, GetService, deleteService };
