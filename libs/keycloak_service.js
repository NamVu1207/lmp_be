const fetch = require('node-fetch')

let login = async (req, res) => {
    try {
        const url = `${process.env.SERVERURL}/auth/realms/${process.env.REALM}/protocol/openid-connect/token`
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", req.body.username)
        urlencoded.append("password", req.body.password)
        urlencoded.append("grant_type", 'password')
        urlencoded.append("client_id", process.env.RESOURCE);
        urlencoded.append("client_secret", process.env.SECRET);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
        };
        const response = await fetch(url, requestOptions)
        return response;
    } catch (error) {
        return { ok: false, statusText: `Đăng nhập thất bại! ${error.message}` };
    }
}

let logout = async (req, res) => {
    const url = `${process.env.AUTHSERVERURL}/protocol/openid-connect/logout`
    const urlencoded = new URLSearchParams();
    urlencoded.append("refresh_token", req.body.refresh_token)
    urlencoded.append("client_id", process.env.RESOURCE);
    urlencoded.append("client_secret", process.env.SECRET);

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlencoded,
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                return response
            }
        })
        .then((result) => {
            return res.json({ ok: true, statusText: "Đã đăng xuất", value: result });
        })
        .catch((error) => { res.status(401).json({ ok: false, statusText: `Logout thất bại \n ${error}` }); });
}

let get_user_info = async (req, res) => {
    try {
        let user_id = req.token_user_id || req.body.user_id;
        if (!user_id) {
            return { ok: false, statusText: `Thiếu thông tin user id` };
        }

        var url = `${process.env.AUTHSERVERURL}/users/${user_id}`

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your t  oken
            },
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy thông tin người dùng thất bại ${error.message}` };
    }
}

let get_group_all = async (req, res) => {
    try {
        var url = `${process.env.AUTHSERVERURL}/groups?search=${process.env.RESOURCE}`

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };

        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy Danh sách nhóm thất bại ${error}` };
    }
}

let get_group_any = async (req, res) => {
    try {
        var group_id = req.group_id || req.body.group_id;
        delete req.group_id;
        var { name } = req.body

        var url = "";

        if (group_id) {
            url = `${process.env.AUTHSERVERURL}/groups/${group_id || ''}`
        }
        else if (name) {
            url = `${process.env.AUTHSERVERURL}/groups?search=${name || ''}`
        }
        else {
            url = `${process.env.AUTHSERVERURL}/groups?search=${process.env.RESOURCE}`
        }

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };

        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy thông tin nhóm thất bại ${error}` };
    }
}

let get_user_in_group = async (req, res) => {
    try {
        let group_id = req.group_id || req.body.group_id;

        var url = "";
        if (!group_id) {
            return { ok: false, statusText: `Thiếu thông tin ID nhóm` };
        }
        url = `${process.env.AUTHSERVERURL}/groups/${group_id}/members`

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your t  oken
            },
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy danh sách người dùng trong nhóm thất bại. ${error}` };
    }
}

let get_session = async (req, res) => {
    try {
        var response_client_id = await get_client_id(req, res);
        if (!response_client_id.ok) {
            return { ok: false, statusText: `Không tim thấy client role \n ${response_client_id.statusText}` };
        }
        else {
            let client_ids = await response_client_id.json();
            req.client_id = client_ids[0].id;
        }

        let url = `${process.env.AUTHSERVERURL}/clients/${req.client_id}/user-sessions`;
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy sessions thất bại \n ${error}` };
    }
}

let get_client_id = async (req, res) => {
    try {
        const url = `${process.env.AUTHSERVERURL}/clients?clientId=${process.env.RESOURCE}`
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { ok: false, statusText: `Lấy client id thất bại. ${response.statusText}` };
        }

        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy client id thất bại \n ${error}` };
    }
}

let get_client_role = async (req, res) => {
    try {
        var response_client_id = await get_client_id(req, res);
        if (!response_client_id.ok) {
            return { ok: false, statusText: `Không tim thấy client role \n ${response_client_id.statusText}` };
        }

        let client_ids = await response_client_id.json();
        let client_id = client_ids[0].id;

        const url = `${process.env.AUTHSERVERURL}/clients/${client_id}/roles`
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { ok: false, statusText: `Lấy client role thất bại. ${response.statusText}` };
        }

        let data = await response.json();
        let { role_id } = req.body;

        if (role_id) {
            if (typeof role_id === 'string') {
                role_id = [{ id: role_id }];
            }
            data = data.filter(cr => role_id.some(ro => ro.id === cr.id));
        }
        data = data.filter(cr => cr.name != "uma_protection");

        return { ok: true, statusText: `Lấy client role thành công`, value: data };
    } catch (error) {
        return { ok: false, statusText: `Lấy client role thất bại \n ${error}` };
    }
}

let get_client_admin_role = async (req, res) => {
    try {
        const url = `${process.env.AUTHSERVERURL}/clients/82b4ee2c-d6e9-44e1-9b3d-b0b76153a32d/roles`
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { ok: false, statusText: `Lấy client role thất bại. ${response.statusText}` };
        }

        let data = await response.json();
        var result = {}
        result["menu"] = data.filter(cr => cr.name.includes('manage-realm'));
        result["user"] = data.filter(cr => cr.name.includes('manage-users'));
        result["user_info"] = data.filter(cr => cr.name.includes('view-users'));

        return { ok: true, statusText: `Lấy client role thành công`, value: result };
    } catch (error) {
        return { ok: false, statusText: `Lấy client role thất bại \n ${error}` };
    }
}


let get_menu_in_user = async (req, res) => {
    try {
        let user_id = req.user_id || req.token_user_id || req.body.user_id;
        if (!user_id) {
            return { ok: false, statusText: `Thiếu thông tin user id` };
        }

        var url = `${process.env.AUTHSERVERURL}/users/${user_id}/role-mappings/realm/composite`

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your t  oken
            },
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy thông tin người dùng thất bại ${error.message}` };
    }
}

let get_list_menu = async (req, res) => {
    try {
        let menu_name = req.menu_name || req.body.menu_name;
        const url = `${process.env.AUTHSERVERURL}/roles?search=${menu_name || process.env.RESOURCE}`
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { ok: false, statusText: `Lấy chức năng thất bại. ${response.statusText}` };
        }

        let data = await response.json();
        let menu_id = req.menu_id || req.body.menu_id;

        if (menu_id) {
            if (typeof menu_id === 'string') {
                menu_id = [{ id: menu_id }];
            }
            data = data.filter(cr => menu_id.some(ro => ro.id === cr.id));
        }
        if (data.length > 0) {
            return { ok: true, statusText: "Lấy chức năng thành công", value: data };
        }
        else {
            return { ok: false, statusText: "id chức năng không tồn tại" };
        }
    } catch (error) {
        return { ok: false, statusText: `Lấy chức năng thất bại \n ${error}` };
    }
}

let get_menu_in_group = async (req, res) => {
    /*EXAMPLE
    {
        "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848",
    }
    */
    try {
        let group_id = req.body.group_id;
        if (!group_id) {
            return { ok: false, statusText: `Thiếu thông tin group id.` };
        }

        let url = `${process.env.AUTHSERVERURL}/groups/${group_id}/role-mappings/realm`;
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            }
        };
        var response = await fetch(url, requestOptions);
        if (!response.ok) {
            return response;
        }
        return response;
    }
    catch (error) {
        return { ok: false, statusText: `Lấy chức năng nhóm thất bại. ${error}` };
    }
}

let save_menu_to_group = async (req, res, pdata) => {
    /*EXAMPLE
    [
      {
          "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848",
          "id": "44e4d174-245b-4538-a332-96cfd5fc2bc9",
          "name": "vslpayment/sa/test",
          "description": "nhóm người test updatedddddd",
          "composite": false,
          "clientRole": false,
          "containerId": "CEH"
      }
    ]
    */
    var response = { data: null, ok: false, statusText: "null" };
    try {
        var data_input = pdata || req.body;
        for (let i = 0; i < data_input.length; i++) {
            var menu_item = data_input[i];
            let group_id = menu_item.group_id;
            if (!group_id) {
                return { ok: false, statusText: `Thiếu thông tin group id.` };
            }
            delete menu_item.group_id;

            let url = `${process.env.AUTHSERVERURL}/groups/${group_id}/role-mappings/realm`;
            var authorization = req.headers.authorization;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authorization, // notice the Bearer before your token
                },
                body: `[${JSON.stringify(menu_item)}]`,
            };
            var response = await fetch(url, requestOptions);
            if (!response.ok) {
                return response;
            }
        }
        return response;
    }
    catch (error) {
        return { ok: false, statusText: `Thêm role cho nhóm thất bại. ${error}` };
    }
}

let save_role_admin_to_group = async (req, res, pdata) => {
    /*EXAMPLE
    [
      {
          "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848",
          "id": "44e4d174-245b-4538-a332-96cfd5fc2bc9",
          "name": "vslpayment/sa/test",
          "description": "nhóm người test updatedddddd",
          "composite": false,
          "clientRole": false,
          "containerId": "CEH"
      }
    ]
    */
    var response = { data: null, ok: false, statusText: "null" };
    try {
        var data_input = pdata || req.body;
        for (let i = 0; i < data_input.length; i++) {
            var role_item = data_input[i];
            let group_id = role_item.group_id;
            if (!group_id) {
                return { ok: false, statusText: `Thiếu thông tin group id.` };
            }
            delete role_item.group_id;

            let url = `${process.env.AUTHSERVERURL}/groups/${group_id}/role-mappings/clients/82b4ee2c-d6e9-44e1-9b3d-b0b76153a32d`;
            var authorization = req.headers.authorization;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authorization, // notice the Bearer before your token
                },
                body: `[${JSON.stringify(role_item)}]`,
            };
            var response = await fetch(url, requestOptions);
            if (!response.ok) {
                return response;
            }
        }
        return response;
    }
    catch (error) {
        return { ok: false, statusText: `Thêm role cho nhóm thất bại. ${error}` };
    }
}

let save_group = async (req, res) => {
    // http://10.10.11.200:8080/auth/admin/realms/CEH/group
    /* EXAMPLES
    {
      "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848"
      "name": "vslpayment_User",
      "role": {
          "vslpayment/sa/user": [
              "get,delete"
          ],
          "general_category": [
              "full,delete"    
          ]
      }
    }
    */
    let resMessage = 'Tạo';
    let _method = 'POST';
    let { group_id } = req.body;
    if (group_id) {
        _method = 'PUT';
        resMessage = 'Cập nhật'
    }

    if (!req.body.name) {
        return { ok: false, statusText: `${resMessage} nhóm thất bại. Thiếu thông tin Tên nhóm` };
    }

    var data_input = req.body;
    delete data_input.group_id;

    if (!data_input.attributes) {
        data_input.attributes = data_input.role;
        delete data_input.role;
    }

    try {
        const url = `${process.env.AUTHSERVERURL}/groups/${group_id || ''}`
        var authorization = req.headers.authorization;
        const requestOptions = {
            method: _method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
            body: JSON.stringify(data_input),
        };

        const response = await fetch(url, requestOptions)
        return response;
    } catch (error) {
        return { ok: false, statusText: `${resMessage} nhóm thất bại ${error}` };
    }
}

let save_user = async (req, res) => {
    // http://10.10.11.200:8080/auth/admin/realms/CEH/users
    /* EXAMPLES
    {
      "username": "app_user_test",
      "firstName": "app_user_firstname",
      "lastName": "app_user_lastname",
      "email": "app_user@test.fr",
      "emailVerified": false,
      "enabled": true,
      "attributes": {
          "phone": "4444444",
          "birthday": "1993-12-26T01:23:45",
          ""
      },
      "groups": [
          "VSLPAYMENT_Admin"
      ],
      "credentials": [
          {
              "temporary": false,
              "type": "password",
              "value": "123"
          }
      ]
    }
    */

    try {
        const user_id = req.user_id || req.body.user_id;
        delete req.body.user_id
        
        var authorization = req.headers.authorization;
        let _method = 'POST';
        let resMessage = 'Tạo';
        if (user_id) {
            _method = 'PUT';
            resMessage = 'Cập nhật'
        }

        let { fullname } = req.body;
        if (fullname) {
            req.body.firstName = fullname.split(' ')[0];
            req.body.lastName = fullname.split(' ').slice(1).join(' ');
            delete req.body.fullname;
        }

        const requestOptions = {
            method: _method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(req.body),
        };

        const url = `${process.env.AUTHSERVERURL}/users/${user_id || ''}`
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            return { ok: false, statusText: `${resMessage} người dùng thất bại. ${response.statusText}` };
        }

        let newUserID = "";
        if (!user_id) {
            newUserID = response.headers.get('location').split('/').at(-1);
        }

        return { ok: true, statusText: `${resMessage} người dùng thành công`, value: newUserID };
    } catch (error) {
        return { ok: false, statusText: `${resMessage} người dùng thất bại. ${error.message}` };
    }
}

let reset_password = async (req, res) => {
    try {
        let { user_id } = req.body;
        if (!user_id) {
            return { ok: false, statusText: `Thiếu thông tin user id` };
        }

        var url = `${process.env.AUTHSERVERURL}/users/${user_id}/reset-password`

        var authorization = req.headers.authorization;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your t  oken
            },
            body: JSON.stringify({
                "type": "password",
                "temporary": "false",
                "value": req.body.password
            })
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return { ok: false, statusText: `Lấy danh sách người dùng trong nhóm thất bại ${error.message}` };
    }
}

let delete_user = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.json({ ok: false, statusText: `id user không để trống` });
        }

        const url = `${process.env.AUTHSERVERURL}/users/${user_id}`
        var authorization = req.headers.authorization;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authorization, // notice the Bearer before your token
            },
        };
        const response = await fetch(url, requestOptions);
        return response;
    } catch (error) {
        return res.status(401).json({ ok: false, statusText: `Xóa user thất bại \n ${error.message}` });
    }
}

let delete_menu_in_group = async (req, res, pdata) => {
    /*EXAMPLE
    [
      {
          "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848",
          "id": "44e4d174-245b-4538-a332-96cfd5fc2bc9",
          "name": "vslpayment/sa/test",
          "description": "nhóm người test updatedddddd",
          "composite": false,
          "clientRole": false,
          "containerId": "CEH"
      }
    ]
    */
    var response = { data: null, ok: false, statusText: "null" };
    try {
        var data_input = pdata || req.body;
        for (let i = 0; i < data_input.length; i++) {
            var menu_item = data_input[i];
            let group_id = menu_item.group_id;
            if (!group_id) {
                return { ok: false, statusText: `Thiếu thông tin group id.` };
            }
            delete menu_item.group_id;

            let url = `${process.env.AUTHSERVERURL}/groups/${group_id}/role-mappings/realm`;
            var authorization = req.headers.authorization;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authorization, // notice the Bearer before your token
                },
                body: `[${JSON.stringify(menu_item)}]`,
            };
            var response = await fetch(url, requestOptions);
            if (!response.ok) {
                return response;
            }
        }
        return response;
    }
    catch (error) {
        return { ok: false, statusText: `Thêm role cho nhóm thất bại. ${error}` };
    }
}

let delete_role_admin_in_group = async (req, res, pdata) => {
    /*EXAMPLE
    [
      {
          "group_id": "da38b068-7928-4f18-a4e0-bf9f44ae9848",
          "id": "44e4d174-245b-4538-a332-96cfd5fc2bc9",
          "name": "vslpayment/sa/test",
          "description": "nhóm người test updatedddddd",
          "composite": false,
          "clientRole": false,
          "containerId": "CEH"
      }
    ]
    */
    var response = { data: null, ok: false, statusText: "null" };
    try {
        var data_input = pdata || req.body;
        for (let i = 0; i < data_input.length; i++) {
            var role_item = data_input[i];
            let group_id = role_item.group_id;
            if (!group_id) {
                return { ok: false, statusText: `Thiếu thông tin group id.` };
            }
            delete role_item.group_id;

            let url = `${process.env.AUTHSERVERURL}/groups/${group_id}/role-mappings/clients/82b4ee2c-d6e9-44e1-9b3d-b0b76153a32d`;
            var authorization = req.headers.authorization;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authorization, // notice the Bearer before your token
                },
                body: `[${JSON.stringify(role_item)}]`,
            };
            var response = await fetch(url, requestOptions);
            if (!response.ok) {
                return response;
            }
        }
        return response;
    }
    catch (error) {
        return { ok: false, statusText: `Thêm role cho nhóm thất bại. ${error}` };
    }
}

module.exports = {
    login, logout,
    get_user_info, get_user_in_group, save_user, reset_password, delete_user,
    get_group_all, get_group_any, save_group,
    get_client_id, get_client_role, get_client_admin_role, get_session,
    get_list_menu, get_menu_in_user, get_menu_in_group, save_menu_to_group, save_role_admin_to_group, delete_role_admin_in_group, delete_menu_in_group
}