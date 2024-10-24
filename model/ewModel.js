const { db } = require("../config/database");
const moment = require("moment-timezone");

const GetListHouse = async () => {
  const query = db("house as h")
    .select("h.id", "h.house_name")
    .leftJoin("room as r", "h.id", "r.house_id")
    .where("h.house_status", true)
    .where("r.is_rented", 'rented');
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const GetListRoom = async () => {
  const query = db("room").distinct("room_name").where("room_status", true);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
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
    .leftJoin("room as r", function () {
      this.on("cont.room_id", "r.id").on(db.raw("r.room_status = true"));
    })
    .leftJoin("customer as cus", "cont.customer_id", "cus.id")
    .leftJoin("house as h", function () {
      this.on("r.house_id", "h.id").on(db.raw("h.house_status = true"));
    })
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

const AddEw = async (
  ewId = 0,
  houseId = "",
  roomName = "",
  isNewEdit = "",
  item = {}
) => {
  if (isNewEdit === "N") {
    //////////// kiểm tra xem đã có tồn tại hợp đòng cho thuê không
    const existRoom = await db("house as h")
      .select("cont.id as contractId")
      .where("h.id", houseId)
      .andWhere("r.room_name", roomName)
      .andWhere("r.is_rented", 'rented')
      .andWhere("r.room_status", true)
      .andWhere("cont.contract_status", true)
      .leftJoin("room as r", "h.id", "r.house_id")
      .leftJoin("contracts as cont", "r.id", "cont.room_id");
    if (existRoom.length === 0) {
      return {
        status: false,
        mess: "phòng không tồn tại hoặc chưa được cho thuê",
      };
    }
    ////////////////////////////////////////

    //////////// Kiểm tra xem có tồn tại dữ liệu chưa
    const existEw = await db("ew_index")
      .select("ew_id")
      .where("contract_id", existRoom[0].contractId)
      .where("month_cons", item.month_cons)
      .where("year_cons", item.year_cons);
    if (existEw.length > 0) {
      return {
        status: false,
        mess: "đã tồn tại dữ liệu",
      };
    }
    //////////////////////////////////////////////////

    //////// Thêm dữ liêu mới
    const idNewEw = await db("ew_index")
      .insert({
        ...item,
        contract_id: existRoom[0].contractId,
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
    return {
      status: true,
      mess: "Thêm mới dữ liệu thành công",
    };
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
    if (item.elec_end !== 0 || item.water_end !== 0) {
      const existNextEw = await db("ew_index")
        .select("ew_id")
        .where("contract_id", idEditEw[0].contractId)
        .where("month_cons", item.month_cons + 1)
        .where("year_cons", item.year_cons);
      if (existNextEw.length === 0) {
        await db("ew_index")
          .insert({
            elec_start: item.elec_end,
            water_start: item.water_end,
            contract_id: idEditEw[0].contractId,
            reading_date: moment().format("YYYY-MM-DD"),
            month_cons: item.month_cons + 1,
            year_cons: item.year_cons,
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
  }
};

module.exports = { GetListHouse, GetEw, DeleteEw, GetListRoom, AddEw };
