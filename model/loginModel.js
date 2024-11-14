const { db } = require("../config/database");
const { Encrypt } = require("../service/authenticate");

const checkUser = (username, password, userType) => {
  return new Promise(async (resolve, reject) => {
    if (userType === 2) {
      db("employee")
        .select("*")
        .where({
          "username": username,
          "pass": password,
        })
        .limit(1)
        .then((user) => {
          if (user.length > 0) {
            delete user[0]["Password"];
            resolve([{ ...user[0], type: 2 }]);
            return;
          } else {
            reject("Not Found !");
            return;
          }
        });
    } else {
      db("customer as cus")
        .select(
          "cus.*",
          "h.id as house_id",
          "h.house_name",
          "r.id as room_id",
          "r.room_name"
        )
        .leftJoin("contract_cus as cc", "cc.customer_id", "cus.id")
        .leftJoin("contracts as cont", "cc.contract_id", "cont.id")
        .leftJoin("room as r", "cont.room_id", "r.id")
        .leftJoin("house as h", "h.id", "r.house_id")
        .where({ phone: username, password: password })
        .where("contract_status", true)
        .where("house_status", true)
        .where("room_status", true)
        .then((user) => {
          if (user.length > 0) {
            delete user[0]["Password"];
            resolve([{ ...user[0], type: 1 }]);
            return;
          } else {
            reject("Not Found !");
            return;
          }
        });
    }
  });
};

module.exports = {
  checkUser,
};
