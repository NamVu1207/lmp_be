const { db } = require("../config/database");
const moment = require("moment-timezone");
const encoder = new TextEncoder();

const GetRoom = async (room_name = "", is_rented = "") => {
  const query = db("house as h")
    .select(
      db.raw("CAST(h.id AS VARCHAR) AS house_id"),
      "h.house_name",
      db.raw(
        "COUNT(CASE WHEN r.is_rented = 'rented' THEN 1 END) AS total_rented"
      ),
      db.raw(
        "COUNT(CASE WHEN r.is_rented = 'available' THEN 1 END) AS total_not_rented"
      ),
      db.raw(
        ` JSON_AGG(
            CASE WHEN r.id IS NOT NULL THEN
              JSON_BUILD_OBJECT(
                'id', r.id, 
                'name', r.room_name, 
                'capacity', r.capacity,
                'floor',r.floor,
                'area',r.area,
                'is_rented', r.is_rented,
                'price',r.price,
                'price_inContract',ct.room_price,
                'description',r.note,
                'customer_name',COALESCE(cus.cus_name,null)
              )
            ELSE 
              JSON_BUILD_OBJECT('no_room', true)
            END
      ) AS rooms`
      )
    )
    .leftJoin("room as r", function () {
      this.on("h.id", "r.house_id").on(db.raw("r.room_status = true"));
    })
    .leftJoin("contracts as ct", function () {
      this.on("r.id", "ct.room_id").on(db.raw("ct.contract_status = true"));
    })
    .leftJoin("customer as cus", "ct.customer_id", "cus.id")
    .where("h.house_status", true)
    .groupBy("h.id");
  if (room_name) query.where("r.room_name", room_name);
  if (is_rented) query.where("r.is_rented", is_rented);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const AddHouse = async (item = {}) => {
  const idnewhouse = await db("house")
    .insert(item)
    .returning("id")
    .catch((err) => console.log(err));
  if (idnewhouse.length > 0) return idnewhouse;
  else return [];
};

const AddRoom = async (item = {}) => {
  const idnewroom = await db("room")
    .insert(item)
    .returning("id")
    .catch((err) => console.log(err));
  if (idnewroom.length > 0) return idnewroom;
  else return [];
};

const DeleteRoom = async (item) => {
  let idroom = [];
  idroom = await db("room")
    .where("id", item)
    .update("room_status", false)
    .returning("id")
    .catch((err) => console.log(err));
  return idroom;
};

const DeleteHouse = async (item) => {
  let idhouse = [];
  idhouse = await db("house")
    .where("id", item)
    .update("house_status", false)
    .returning("id")
    .catch((err) => console.log(err));
  return idhouse;
};

const AddContract = async (renter, contract) => {
  let idCustomer;
  const existCustomer = await db("customer")
    .select("id")
    .where("cccd", renter.cccd);
  if (existCustomer.length === 0) {
    idCustomer = await db("customer")
      .insert(renter)
      .returning("id")
      .catch((err) => console.log(err));
  } else {
    idCustomer = await db("customer")
      .where("id", existCustomer[0].id)
      .update(renter)
      .returning("id")
      .catch((err) => console.log(err));
  }
  const newContract = { ...contract, customer_id: idCustomer[0].id };
  const idContract = await db("contracts")
    .insert(newContract)
    .returning("id")
    .catch((err) => console.log(err));
  if (idContract.length > 0) {
    await db("room")
      .where("id", contract.room_id)
      .update({ "is_rented": "rented" });
    await db("contract_cus").insert({
      customer_id: idCustomer[0].id,
      contract_id: idContract[0].id,
    });
    return idContract;
  }
  return [];
};

const CancelRent = async (id = {}) => {
  const contract = await db("contracts")
    .where("room_id", id)
    .andWhere("contract_status", true);
  if (contract.length > 0) {
    await db("room").where("id", id).update({ "is_rented": "available" });
    await db("contracts")
      .where("room_id", id)
      .andWhere("contract_status", true)
      .update({
        "contract_status": false,
        "day_end": moment().format("YYYY-MM-DD"),
      });
    return { success: true, message: "đã chấm dứt hợp đồng" };
  } else return { success: false, message: "không có hợp đồng thích hợp" };
};

module.exports = {
  GetRoom,
  AddHouse,
  AddRoom,
  DeleteRoom,
  AddContract,
  CancelRent,
  DeleteHouse,
};
