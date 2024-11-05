const { db } = require("../config/database");
const moment = require("moment-timezone");

const getListEmployee = async () => {
  const query = db("employee").select("id", "employee_name");
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const getHouse = async (city) => {
  const query = db("house").select("*").where("house_status", true);
  if (city) query.where("city", city);
  const house = await query.catch((err) => console.log(err));
  const result = house.map((item) => ({
    ...item,
    manager: item.manager ?? "",
  }));
  return result;
};

const save = async (houseId, item) => {
  if (!item.manager) delete item.manager;
  const existHouse = await db("house").select("id").where("id", houseId);
  if (existHouse.length > 0) {
    const id = await db("house")
      .where("id", houseId)
      .update(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Cập nhập thành công" };
    } else return { success: false, message: "Cập nhập thất bại" };
  } else {
    const id = await db("house")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

const deleteHouse = async (item = {}) => {
  const id = await db("house")
    .where("id", item.id)
    .update("house_status", false)
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    return { success: true, message: "Xóa thành công" };
  } else return { success: false, message: "Xóa thất bại" };
};

module.exports = { getListEmployee, getHouse, save, deleteHouse };
