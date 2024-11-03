const moment = require("moment-timezone");
const { db } = require("../../config/database");
const ewModel = require("../../model/ewModel");

const listHouse = async (req, res, next) => {
  const result = await ewModel.GetListHouse();
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const listRoom = async (req, res, next) => {
  const result = await ewModel.GetListRoom();
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

const CheckRoom = async (req, res, next) => {
  const houseId = req.body.house_id;
  const roomName = req.body.room_name;
  let result;
  const checkRoom = await ewModel.CheckRoom(houseId, roomName);
  if (checkRoom.length > 0) result = { success: true, data: checkRoom[0] };
  else
    result = {
      success: false,
      data: "phòng không tồn tại hoặc chưa được thuê",
    };
  res.status(200).json({ status: 200, ...result });
  return;
};

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
      const isNewEdit = data?.isNew ? "N" : data?.isEdit ? "E" : "";
      const ewId = data?.ew_id ?? 0;
      const contractId = data.contract_id;
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
        isNewEdit,
        contractId,
        item
      );
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = { listHouse, getEw, listRoom, deleteEw, AddEw, CheckRoom };
