const { db } = require("../config/database");
const moment = require("moment-timezone");

const getStaff = async (staffInfo) => {
  const query = db("employee").select("*");
  if (staffInfo) query.where("employee_name", "like", `%${staffInfo}%`);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const save = async (staffId, item) => {
  const existStaff = await db("employee").select("id").where("id", staffId);
  if (existStaff.length > 0) {
    const id = await db("employee")
      .where("id", staffId)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const id = await db("employee")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

const deleteStaff = async (item = {}) => {
  const isManager = await db("house")
    .select("house_name")
    .where("manager", item.id)
    .where("house_status", true);
  if (isManager.length > 0) {
    console.log(isManager);
    return {
      success: false,
      message: `Nhân viên hiện đang là quản lý`,
    };
  } else {
    await db("house")
      .where("manager", item.id)
      .andWhere("house_status", false)
      .update({ manager: null })
      .catch((err) => console.log(err));
    const id = await db("employee")
      .where("id", item.id)
      .del()
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Xóa thành công" };
    } else return { success: false, message: "Xóa thất bại" };
  }
};

module.exports = { getStaff, save, deleteStaff };
