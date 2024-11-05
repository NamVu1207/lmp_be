const moment = require("moment-timezone");
const { db } = require("../../config/database");
const staffModel = require("../../model/staffModel");

const getStaff = async (req, res, next) => {
  let { staff_name = "" } = req.body;
  const result = await staffModel.getStaff(staff_name);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const staffId = Number(data.id);
      const item = {
        employee_name: data.employee_name,
        phone: data.phone,
        username: data.username,
        pass: data?.pass ? data.pass : "123456",
        department: data.department,
      };
      const result = await staffModel.save(staffId, item);
      arr_msg.push(result);
    }
    outputs = { message: arr_msg };
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteStaff = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await staffModel.deleteStaff(data);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  save,
  getStaff,
  deleteStaff,
};
