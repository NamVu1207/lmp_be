const { db } = require("../config/database");
const moment = require("moment-timezone");

const GetListHouse = async () => {
  const query = db("house as h")
    .select("h.id", "h.house_name")
    .where("h.house_status", true);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const GetListRoom = async () => {
  const query = db("room as r")
    .distinct("r.room_name")
    .leftJoin("house as h", "r.house_id", "h.id")
    .where("r.room_status", true)
    .where("h.house_status", true);
  let result = await query.catch((err) => console.log(err));
  return result;
};

const CheckRoom = async (houseId, roomName) => {
  const CusName = await db("house as h")
    .select("cus.cus_name as name", "cont.id as contractId")
    .where("h.id", houseId)
    .andWhere("r.room_name", roomName)
    .andWhere("r.is_rented", "rented")
    .andWhere("r.room_status", true)
    .andWhere("cont.contract_status", true)
    .leftJoin("room as r", "h.id", "r.house_id")
    .leftJoin("contracts as cont", "r.id", "cont.room_id")
    .leftJoin("customer as cus", "cont.customer_id", "cus.id");
  return CusName;
};

const GetEw = async (house_id, dateN) => {
  const query = db("ew_index as ew")
    .select(
      "ew.*",
      "r.room_name",
      "cus.cus_name",
      "h.house_name",
      "h.id as house_id"
    )
    .leftJoin("contracts as cont", "ew.contract_id", "cont.id")
    .leftJoin("room as r", "cont.room_id", "r.id")
    .leftJoin("customer as cus", "cont.customer_id", "cus.id")
    .leftJoin("house as h", "r.house_id", "h.id")
    .where("h.house_status", true)
    .where("r.room_status", true)
    .orderBy("ew.month_cons", "ew.year_cons");
  if (house_id) query.where("h.id", house_id);
  if (dateN) {
    const val = {
      month_cons: moment(dateN).month() + 1,
      year_cons: moment(dateN).year(),
    };
    query.where(val);
  }
  let result = await query.catch((err) => console.log(err));
  if (result.length === 0) return [];
  return result;
};

const DeleteEw = async (val = "") => {
  const id = await db("ew_index").where("ew_id", val).del().returning("ew_id");
  return id;
};

const AddEw = async (ewId = 0, isNewEdit = "", contractId = "", item = {}) => {
  //////////// Kiểm tra xem có tồn tại dữ liệu chưa
  const existEw = await db("ew_index")
    .select("ew_id")
    .where("contract_id", contractId)
    .where("month_cons", item.month_cons)
    .where("year_cons", item.year_cons);
  //////////////////////////////////////////////////
  if (isNewEdit === "N") {
    if (existEw.length > 0) {
      return {
        status: false,
        mess: "đã tồn tại dữ liệu",
      };
    }
    //////// Thêm dữ liêu mới
    const idNewEw = await db("ew_index")
      .insert({
        ...item,
        contract_id: contractId,
        reading_date: moment().format("YYYY-MM-DD"),
      })
      .returning("ew_id")
      .catch((err) => console.log(err));
    if (idNewEw.length === 0) {
      return {
        status: false,
        mess: "Thêm mới dữ liệu thất bại",
      };
    }
  }
  if (isNewEdit === "E") {
    const idEditEw = await db("ew_index")
      .where("ew_id", ewId)
      .update({ ...item, reading_date: moment().format("YYYY-MM-DD") })
      .returning("contract_id as contractId")
      .catch((err) => console.log(err));
    if (idEditEw.length === 0) {
      return {
        status: false,
        mess: "Cập nhập dữ liệu thất bại",
      };
    }
  }
  if (item.elec_end !== 0 || item.water_end !== 0) {
    const existNextEw = await db("ew_index")
      .select("ew_id")
      .where("contract_id", contractId)
      .where("month_cons", item.month_cons + 1)
      .where("year_cons", item.year_cons);
    if (existNextEw.length === 0) {
      await db("ew_index")
        .insert({
          elec_start: item.elec_end,
          water_start: item.water_end,
          contract_id: contractId,
          reading_date: moment().format("YYYY-MM-DD"),
          month_cons: item.month_cons + 1 === 13 ? 1 : item.month_cons + 1,
          year_cons:
            item.month_cons + 1 === 13 ? item.year_cons + 1 : item.year_cons,
        })
        .returning("ew_id")
        .catch((err) => console.log(err));
    } else {
      await db("ew_index")
        .where("ew_id", existNextEw[0].ew_id)
        .update({
          elec_start: item.elec_end,
          water_start: item.water_end,
          reading_date: moment().format("YYYY-MM-DD"),
        });
    }
  }
  return {
    status: true,
    mess: "Cập nhập dữ liệu thành công",
  };
};

module.exports = {
  GetListHouse,
  GetEw,
  DeleteEw,
  GetListRoom,
  AddEw,
  CheckRoom,
};
