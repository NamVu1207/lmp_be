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

module.exports = { GetListHouse };
