const { db } = require("../config/database");
const moment = require("moment-timezone");

const CheckRoom = async (houseId, roomName) => {
  const result = await db("room")
    .select("id")
    .where("house_id", houseId)
    .andWhere("room_name", roomName)
    .andWhere("is_rented", "rented");
  return result;
};

const GetCustomer = async (cus_info, house_id, contractActive) => {
  const query = db("customer as cus")
    .select(
      "cus.*",
      "h.house_name",
      "h.id as house_id",
      "r.room_name",
      "r.id as room_id",
      "r.capacity",
      "cont.id as contract_id",
      "cont.contract_status"
    )
    .innerJoin("contract_cus as cc", "cus.id", "cc.customer_id")
    .leftJoin("contracts as cont", "cc.contract_id", "cont.id")
    .leftJoin("room as r", "cont.room_id", "r.id")
    .leftJoin("house as h", "r.house_id", "h.id")
    .where("h.house_status", true)
    .where("r.room_status", true)
    .orderBy("cus.id", "asc");
  if (house_id) query.where("h.id", house_id);
  if (cus_info)
    query.where(function () {
      this.where("cus.cus_name", "like", `%${cus_info}%`).orWhere(
        "cus.cccd",
        "like",
        `%${cus_info}%`
      );
    });
  if (contractActive !== "")
    query.where("cont.contract_status", contractActive);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const save = async (customerId, contractId, item = {}) => {
  const existCustomer = await db("customer") //kiểm tra xem có tồn tại khách hàng chưa
    .select("id")
    .where("cccd", item.cccd)
    .orWhere("id", customerId);
  if (existCustomer.length > 0) {
    const hasContract = await db("contract_cus as cc") //kiểm tra xem khách hàng có trong một hợp đòng còn hiệu lực không
      .select("cc.contract_id")
      .leftJoin("contracts as cont", "cc.contract_id", "cont.id")
      .where("cc.customer_id", existCustomer[0].id)
      .where("cont.contract_status", true);
    if (hasContract.length > 0) {
      if (hasContract[0].contract_id === contractId) {
        const id = await db("customer")
          .where("id", existCustomer[0].id)
          .update(item)
          .returning("id")
          .catch((err) => console.log(err));
        if (id.length > 0) {
          return { success: true, message: "Cập nhập thành công" };
        } else return { success: false, message: "Cập nhập thất bại" };
      } else
        return {
          success: false,
          message: "khách hàng đang trong hợp đồng khác",
        };
    } else {
      const id = await db("customer")
        .where("id", existCustomer[0].id)
        .update(item)
        .returning("id")
        .catch((err) => console.log(err));
      if (id.length > 0) {
        await db("contract_cus").insert({
          customer_id: id[0].id,
          contract_id: contractId,
        });
        return { success: true, message: "Cập nhập thành công" };
      } else return { success: false, message: "Cập nhập thất bại" };
    }
  } else {
    const id = await db("customer")
      .insert(item)
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      await db("contract_cus").insert({
        customer_id: id[0].id,
        contract_id: contractId,
      });
      return { success: true, message: "Thêm mới thành công" };
    } else return { success: false, message: "Thêm mới thất bại" };
  }
};

const DeleteCustomer = async (item = {}) => {
  const isRenter = await db("contracts")
    .select("id")
    .where("customer_id", item.id);
  if (isRenter.length > 0) {
    return { success: false, message: "không thể xóa người đứng tên hợp đồng" };
  } else {
    const id = await db("contract_cus")
      .where("customer_id", item.id)
      .del()
      .returning("id")
      .catch((err) => console.log(err));
    if (id.length > 0) {
      return { success: true, message: "Xóa thành công" };
    } else return { success: false, message: "Xóa thất bại" };
  }
};

module.exports = { CheckRoom, GetCustomer, save, DeleteCustomer };
