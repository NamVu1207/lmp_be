var express = require("express");
var router = express.Router();
var { auth } = require("../../service/authenticate");
const userModel = require("../../model/loginModel");
const moment = require("moment-timezone");
var jwt = require("jsonwebtoken");
const { config } = require("../../config/config");

router.post("/login", async (req, res) => {
  try {
    userModel
      .checkUser(req.body.username, req.body.password, req.body.usertype)
      .then(async (user) => {
        if (user.length == 0) {
          return res
            .status(200)
            .json({ status: 400, message: "Sai tên đăng nhập hoặc mật khẩu" });
        }
        if (user[0]["IsActive"] == 0) {
          return res
            .status(200)
            .json({ status: 400, message: "Người dùng chưa được kích hoạt" });
        }
        let token = jwt.sign({ id: user.UserName }, config.encrypt_key, {
          expiresIn: 864000000, // expires in 24 hours
        });

        return res.status(200).json({
          status: 200,
          success: true,
          message: "Login Success",
          authorized: true,
          access_token: token,
          user: user,
        });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(200)
          .json({ status: 400, message: "Sai tên đăng nhập hoặc mật khẩu !" });
      });
  } catch (e) {
    if (e == "Not Found") {
      return res.status(400).json({ status: 400, message: e.message });
    }
    console.error(e);
  }
});

module.exports = router;
