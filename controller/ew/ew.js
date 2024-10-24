const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const getEw = async (req, res, next) => {
  const house_id = req.body.house_id;
  const dateN = req.body.date;
  const result = await ewModel.GetEw(house_id, dateN);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const listRoom = async (req, res, next) => {
  const result = await ewModel.GetListRoom();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};
// const AddDepartment = async (req, res, next) => {
//   let datas = req.body.datas;
//   let outputs = {};
//   let arr_msg = [];
//   if (datas.length) {
//     for await (let data of datas) {
//       const item = {
//         "departmentID": data.departmentID,
//         "checkin": data.checkin,
//         "checkout": data.checkout,
//         "dateN": data.dateN,
//       };
//       const result = await departmentModel.AddDepartment(item);
//       arr_msg.push(result);
//     }
//     outputs["message"] = arr_msg;
//   }
//   res.status(200).json({ status: 200, success: true, data: outputs });
//   return;
// };

const deleteEw = async (req, res, next) => {
  let datas = req.body.data;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      let id = data.ew_id;
      const result = await ewModel.DeleteEw(id);
      if (result.length > 0)
        arr_msg.push({
          status: true,
          mess: `Xóa thành công`,
        });
      else
        arr_msg.push({
          status: false,
          mess: `Xóa không thành công`,
        });
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const AddEw = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    for await (let data of datas) {
      const houseId = data.house_id;
      const roomName = data.room_name;
      const isNewEdit = data?.isNew ? "N" : data?.isEdit ? "E" : "";
      const ewId = data?.ew_id ?? 0;
      const item = {
        "elec_start": Number(data.elec_start),
        "elec_end": Number(data.elec_end),
        "water_start": Number(data.water_start),
        "water_end": Number(data.water_end),
        "elec_cost": Number(data.elec_cost),
        "water_cost": Number(data.water_cost),
        "month_cons": data.month_cons,
        "year_cons": data.year_cons,
      };
      const result = await ewModel.AddEw(
        ewId,
        houseId,
        roomName,
        isNewEdit,
        item
      );
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = { listHouse, getEw, listRoom, deleteEw, AddEw };
