const moment = require("moment-timezone");
const { db } = require("../../config/database");
const userModel = require("../../model/userModel");

const listuser = async (req, res, next) => {
  let { role = "", department = "" } = req.body;
  const result = await userModel.GetListUsers(role, department);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const saveuser = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const item = {
        "userID": data.userID,
        "userName": data.userName,
        "departmentID": data.departmentID,
        "groupID": data.groupID,
        "passw": data.passw,
      };
      const result = await userModel.SaveUser(item);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const deleteuser = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      let userID = data.userID;
      const result = await userModel.DeleteUser(userID);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const GetListDepartment = async (req, res, next) => {
  const result = await userModel.GetListDepartments();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
}

const GetListGroups = async (req, res, next) => {
  const result = await userModel.GetListGroups();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
}

module.exports = {
  listuser,
  saveuser,
  deleteuser,
  GetListDepartment,
  GetListGroups,
};
