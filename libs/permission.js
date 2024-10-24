// const KeyCloakService = require("../libs/keyCloakService.js");
// const permission = async (req, res, next, resource, scope) => {
//   let url = req.baseUrl.split("/").at(-1);
//   let keyCloak = new KeyCloakService();
//   try {
//     const rsAuth = await keyCloak.checkPermission(req, resource, scope);
//     next();
//   } catch (error) {
//     // res.end("error " + error);
//     res.status(400).json({ error });
//   }
// }

const { jwtDecode } = require('jwt-decode');
const { get_users } = require('../model/sa/user');

const permission = async (req, res, next) => {
  try {
    var authorization = req.headers.authorization;
    var token = String(authorization).split(' ')[1];
    if (!token[1]) {
      next();
    }

    token = jwtDecode(token);
    req.token_user_id = token.sub;
    var response = await get_users(req, res);
    delete req.token_user_id
    if (!response.ok) {
      return res.status(401).json({ ok: false, statusText: `Người dùng chưa được phân quyền. ${response.statusText}` });
    }
    else if (response.value[0]) {


      var data_role_in_group = response.value[0].role;
      let request_scope = process.env.RESOURCE.toLowerCase() + req.baseUrl;
      let request_permission = req.url.split("_")[0].replace('/', 'get');

      let has_permission = false;
      Object.entries(data_role_in_group).map(([key, val] = entry) => {
        if (key == request_scope && (val == request_permission || val == 'full')) {
          has_permission = true;
        }
      })

      // var user_menu = []
      // var user_role = []
      // let _checkScope = user_menu.includes(request_scope) || user_menu.includes('administrator');
      // let _checkPermission = user_role.includes(request_permission)
      //   || user_role.includes('full');
      if (has_permission) {
        next();
      } else {
        return res.status(401).json({ ok: false, statusText: `Bạn chưa được phân quyền sử dụng chức năng này!` });
      }
    }
    else {
      return res.status(401).json({ ok: false, statusText: `Bạn chưa được phân quyền sử dụng chức năng này! ${response.statusText}` });
    }
  } catch (error) {
    return res.status(401).json({ ok: false, statusText: `Lỗi phân quyền! ${error}` });
  }
  finally {
    delete req.token_user_id
  }
}



module.exports = { permission };



// "use strict";

// const UrlPattern = require("url-pattern");

// class Permissions {
//   constructor(permissions) {
//     this.publicUrls = [];
//     this.permissions = [];
//     permissions.forEach((permission) => {
//       let url = new UrlPattern(permission[0]);
//       let method = permission[1].toUpperCase();
//       let resource = permission[2];
//       let scope = permission[3];
//       this.permissions.push({
//         url: url,
//         method: method,
//         resource: resource,
//         scope: scope,
//       });
//     });
//   }

//   notProtect(...publicUrls) {
//     publicUrls.forEach((url) => this.publicUrls.push(new UrlPattern(url)));
//     return this;
//   }

//   findPermission(request) {
//     return this.permissions.find(
//       (p) =>
//         request.method.toUpperCase() === p.method &&
//         p.url.match(request.originalUrl)
//     );
//   }

//   isNotProtectedUrl(request) {
//     let url = request.originalUrl;
//     let result = this.publicUrls.find((u) => u.match(url));
//     return result !== undefined;
//   }
// }

