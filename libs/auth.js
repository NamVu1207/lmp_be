const { jwtDecode } = require('jwt-decode');
const { get_user_info } = require("../model/sa/user.js");
// const { get_client_id, get_session } = require("./keycloak_service.js");


let auth = async (req, res, next) => {
  var authorization = req.headers.authorization;
  var token = String(authorization).split(' ')[1];
  if (!token) {
    return res.status(401).json({ ok: false, statusText: "Token xác thực không thành công!" });
  }

  const token_info = jwtDecode(token);
  let user = {
    user: token_info["preferred_username"],
    name: token_info.name,
    email: token_info.email
  };
  req.userInfo = user

  if (req.url != "/save_reset_password") {
    req.token_user_id = token_info["sub"];

    var response = await get_user_info(req, res);
    if (!response.ok) {
      return res.status(401).json({ ok: false, statusText: `Người dùng chưa xác thực. ${response.statusText}` });
    }
    else {
      var data = await response.json();
      if (data?.attributes?.requiredActions) {
        return res.status(401).json({ ok: false, message: `Vui lòng thực hiện ${data?.attributes?.requiredActions}` });
      }
    }
  }
  delete req.token_user_id;
  next();
  // try {
  //   var response = await get_session(req, res);
  //   if (response.ok) {
  //     var sessions = await response.json();
  //     if (!sessions?.filter((sessions) => sessions.id == token_info.session_state)) {
  //       return res.status(401).json({ ok: false, statusText: "Token xác thực không thành công! hết thời gian truy cập" });
  //     }
  //     neawait response.json();)
  //   }
  //   else {
  //     return res.status(401).json({ ok: false, statusText: "Token xác thực không thành công!" + response.statusText });
  //   }
  // }
  // catch (error) {
  //   return res.status(401).json({ ok: false, statusText: "Token xác thực không thành công!" + error });
  // }
};

module.exports = { auth };