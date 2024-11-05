const { db } = require("../config/database");
const moment = require("moment-timezone");

const getExpenses = async (year) => {
  const months = Array.from({ length: 12 }, (v, i) => i + 1);
  const query = db
    .select("m.month")
    .from(
      db.raw(
        `(VALUES ${months.map((month) => `(${month})`).join(",")}) AS m(month)`
      )
    )
    .leftJoin("rentalfee as rf", function () {
      this.on("m.month", "=", "rf.payment_month").andOn(
        "rf.payment_year",
        "=",
        year
      );
    })
    .leftJoin("otherfee as of", function () {
      this.on(
        db.raw("EXTRACT(MONTH FROM of.created_at)"),
        "=",
        "m.month"
      ).andOn(db.raw("EXTRACT(YEAR FROM of.created_at)"), "=", year);
    })
    .select(
      db.raw(`COALESCE(SUM(rf.price), 0) as rental_fee`),
      db.raw(`COALESCE(SUM(of.price), 0) as other_fee`)
    )
    .orderBy("m.month")
    .groupBy("m.month");
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const getRoomCountByStatus = async () => {
  const query = db("room")
    .select("is_rented as status", db.raw(`COUNT(*) AS count`))
    .leftJoin("house as h", "h.id", " house_id")
    .where("room_status", true)
    .where("house_status", true)
    .groupBy("is_rented");
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const getBooking = async () => {
  const query = db("booking as b")
    .select(
      "b.id",
      "b.cus_name",
      "h.house_name",
      "r.room_name",
      "b.target_date"
    )
    .leftJoin("house as h", "h.id", "b.house_id")
    .leftJoin("room as r", "r.id", "b.room_id")
    .whereRaw(`EXTRACT(MONTH FROM b.target_date) = ${moment().month() + 1}`)
    .whereRaw(`EXTRACT(YEAR FROM b.target_date) = ${moment().year()}`)
    .where("b.booking_status", true)
    .where("r.room_status", true)
    .where("h.house_status", true);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

module.exports = { getExpenses, getRoomCountByStatus, getBooking };
