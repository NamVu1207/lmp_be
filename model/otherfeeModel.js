const { db } = require("../config/database");
const moment = require("moment-timezone");

const load = async (house_id) => {
  const query = db("otherfee as of")
    .select("of.*")
    .leftJoin("house as h", "of.house_id", "h.id")
    .where("h.house_status", true);
  if (house_id) query.where("of.house_id", house_id);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const save = async (otherId, item) => {
  const existItem = await db("otherfee").select("id").where("id", otherId);
  if (existItem.length > 0) {
    const id = await db("otherfee")
      .where("id", otherId)
      .update({
        ...item,
        updated_at: moment().format("YYYY-MM-DD"),
      })
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const id = await db("otherfee")
      .insert({
        ...item,
        updated_at: moment().format("YYYY-MM-DD"),
        created_at: moment().format("YYYY-MM-DD"),
      })
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

const deleteOtherfee = async (item = {}) => {
  const id = await db("otherfee")
    .where("id", item.id)
    .del()
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    return { success: true, message: "Xóa thành công" };
  } else return { success: false, message: "Xóa thất bại" };
};

module.exports = { load, save, deleteOtherfee };
