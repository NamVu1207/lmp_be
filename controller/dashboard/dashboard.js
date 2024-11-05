const moment = require("moment-timezone");
const { db } = require("../../config/database");
const dasModel = require("../../model/dashboardModel");

const getExpenses = async (req, res, next) => {
  let { year = 0 } = req.body;
  const result = await dasModel.getExpenses(year);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const countRoomByStatus = async (req, res, next) => {
  const result = await dasModel.getRoomCountByStatus();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getBooking = async (req, res, next) => {
  const result = await dasModel.getBooking();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

// const save = async (req, res, next) => {
//   let datas = req.body.datas;
//   let outputs = {};
//   let arr_msg = [];
//   if (datas.length > 0) {
//     for await (let data of datas) {
//       const staffId = Number(data.id);
//       const item = {
//         employee_name: data.employee_name,
//         phone: data.phone,
//         username: data.username,
//         pass: data?.pass ? data.pass : "123456",
//         department: data.department,
//       };
//       const result = await staffModel.save(staffId, item);
//       arr_msg.push(result);
//     }
//     outputs = { message: arr_msg };
//   }
//   res.status(200).json({ status: 200, success: true, data: outputs });
//   return;
// };

// const deleteStaff = async (req, res, next) => {
//   let datas = req.body.data;
//   let outputs = {};
//   let arr_msg = [];
//   if (datas.length) {
//     for await (let data of datas) {
//       const result = await staffModel.deleteStaff(data);
//       arr_msg.push(result);
//     }
//     outputs["message"] = arr_msg;
//   }
//   res.status(200).json({ status: 200, success: true, data: outputs });
//   return;
// };

module.exports = {
  countRoomByStatus,
  getExpenses,
  getBooking,
};
