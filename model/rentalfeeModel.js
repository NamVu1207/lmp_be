const { db } = require("../config/database");
const moment = require("moment-timezone");

const CheckRoom = async (houseId, roomName) => {
  const query = db("room")
    .select("id")
    .where("house_id", houseId)
    .andWhere("room_name", roomName)
    .andWhere("is_rented", "rented");
  const result = await query.catch((err) => console.log(err));
  return result;
};

const getBill = async (room_name, house_id, month) => {
  const currentMonth = moment(month).month() + 1;
  const currentYear = moment(month).year();
  const validroom = await CheckRoom(house_id, room_name);
  if (validroom.length > 0) {
    const query = db("room as r")
      .select(
        "r.id as room_id",
        "r.room_name",
        "cont.id as contract_id",
        "cont.room_price",
        "ew.elec_cost",
        db.raw("(ew.elec_end - ew.elec_start) as elec_quantity"),
        db.raw("(ew.water_end - ew.water_start) as water_quantity"),
        "ew.water_cost",
        "ew.month_cons",
        "ew.year_cons",
        // "rf.payment_status",
        db.raw(
          ` JSON_AGG(
                CASE WHEN rs.id IS NOT NULL THEN
                  JSON_BUILD_OBJECT(
                    'id', rs.service_id,
                    'name', serv.serv_name,
                    'price', serv.price,
                    'quantity', rs.amount
                  )
                ELSE 
                  JSON_BUILD_OBJECT('no_service', true)
                END
          ) AS services`
        )
      )
      .leftJoin("contracts as cont", function () {
        this.on("r.id", "cont.room_id").on(
          db.raw("cont.contract_status = true")
        );
      })
      .leftJoin("ew_index as ew", function () {
        this.on("cont.id", "ew.contract_id")
          .on(db.raw(`ew.month_cons = ${currentMonth}`))
          .on(db.raw(`ew.year_cons = ${currentYear}`));
      })
      .leftJoin("rentalfee as rf", function () {
        this.on("cont.id", "rf.contract_id")
          .on(db.raw(`rf.payment_month = ${currentMonth}`))
          .on(db.raw(`rf.payment_year = ${currentYear}`));
      })
      .leftJoin("room_service as rs", "r.id", "rs.room_id")
      .leftJoin("services as serv", "rs.service_id", "serv.id")
      .where("r.house_id", house_id)
      .where("r.room_name", room_name)
      .groupBy("r.id", "cont.id", "ew.ew_id");
    const result = await query.catch((err) => console.log(err));
    return { success: true, data: result };
  } else {
    return { success: false, message: "phòng không tồn tại hoặc chưa thuê" };
  }
};

const submitBill = async (billInfo) => {
  const item = {
    ...billInfo,
    payment_date: moment().format("YYYY-MM-DD"),
    payment_status: true,
  };
  const idBill = await db("rentalfee")
    .insert(item)
    .returning("id")
    .catch((err) => console.log(err));
  if (idBill.length > 0) {
    return { success: true, message: "Thanh toán thành công" };
  } else return { success: false, message: "Thanh toán thất bại" };
};

const load = async (room_name, house_id, month) => {
  const query = db("rentalfee as rf")
    .select(
      "rf.*",
      "h.house_name",
      "h.id as house_id",
      "r.room_name",
      "r.id as room_id"
    )
    .leftJoin("contracts as cont", "rf.contract_id", "cont.id")
    .leftJoin("room as r", "cont.room_id", "r.id")
    .leftJoin("house as h", "r.house_id", "h.id")
    .where("house_status", true)
    .where("room_status", true);
  if (room_name) query.where("r.room_name", room_name);
  if (house_id) query.where("h.id", house_id);
  if (month) {
    query
      .where("rf.payment_month", moment(month).month() + 1)
      .andWhere("rf.payment_year", moment(month).year());
  }
  const result = await query.catch((err) => console.log(err));
  return result;
};

const deleteBill = async (item = {}) => {
  const id = await db("rentalfee")
    .where("id", item.id)
    .del()
    .returning("id")
    .catch((err) => console.log(err));
  if (id.length > 0) {
    return { success: true, message: "Xóa thành công" };
  } else return { success: false, message: "Xóa thất bại" };
};
module.exports = { getBill, submitBill, load, deleteBill };
