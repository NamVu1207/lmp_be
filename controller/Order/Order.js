const moment = require("moment-timezone");
const { db } = require("../../config/database");
const orderModel = require("../../model/orderModel");
const { notificationToManagers } = require("../../service/socketServer");

const getService = async (req, res, next) => {
  let { order_status = "", cus_name = "" } = req.body;
  const result = await orderModel.getService(order_status, cus_name);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};
const changePassword = async (req, res, next) => {
  let { customerId = "", newPaasword = "" } = req.body;
  const result = await orderModel.ChangePassword(customerId, newPaasword);
  res.status(200).json({ status: 200, success: true, data: result });
  return;
};

const save = async (req, res, next) => {
  let datas = req.body.datas;
  let outputs = {};
  let arr_msg = [];
  if (datas.length > 0) {
    const data = datas[0];
    const item = {
      house_id: Number(data.house_id),
      room_id: Number(data.room_id),
      customer_id: Number(data.customer_id),
      service_id: Number(data.service_id),
      target_date: moment(data.target_date).format("YYYY-MM-DD"),
      target_time: moment(data.target_time).format("HH:mm:ss"),
      note: data.note || "",
    };
    const result = await orderModel.save(item);
    if (result.success)
      notificationToManagers(
        JSON.stringify({
          success: result.success,
          title: `Phòng ${result.roomName}`,
          message: "Đã đạt dịch vụ",
        })
      );
    arr_msg.push(result);
  }
  outputs = { message: arr_msg };
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

const confirm = async (req, res, next) => {
  let datas = req.body.data;
  let type = req.body.type;
  let outputs = {};
  let arr_msg = [];
  if (datas.length) {
    for await (let data of datas) {
      const result = await orderModel.confirm(data, type);
      arr_msg.push(result);
    }
    outputs["message"] = arr_msg;
  }
  res.status(200).json({ status: 200, success: true, data: outputs });
  return;
};

module.exports = {
  save,
  getService,
  confirm,
  changePassword,
};
