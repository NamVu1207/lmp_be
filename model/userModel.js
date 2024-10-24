const { db } = require("../config/database");

const GetListUsers = async (role = "", department = "") => {
  const query = db("users as u").select("*");
  if (role) query.where("u.groupID", role);
  if (department) query.where("u.departmentID", department);
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  return result;
};

const SaveUser = async (item = {}) => {
  let existUser = await db("users as u")
    .select("userID")
    .where("u.userID", item.userID);
  if (existUser.length) {
    const userID =
      (await db("users as u")
        .where("u.userID", item.userID)
        .update(item)
        .catch((err) => console.log(err))) || "";
    if (userID !== "") return "Cập nhập thành công";
    return "Cập nhập thất bại";
  } else {
    await db("users")
      .insert(item)
      .catch((err) => console.log(err));
    return "Thêm mới thành công";
  }
};

const DeleteUser = async (userID = "") => {
  await db("users").where("userID", userID).del();
  return "Xóa thành công";
};

const GetListDepartments = async () => {
  const query = db("departments").select("departmentID");
  let result = [];
  result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  let arr_department = [];
  result.map((item) => arr_department.push(item.departmentID));
  return arr_department;
};

const GetListGroups = async () => {
  const query = db("permission").select("groupID");
  let result = await query.catch((err) => console.log(err));
  if (!result.length) return [];
  let arr_group = result.map((item) => item.groupID);
  return arr_group;
};

module.exports = {
  GetListUsers,
  SaveUser,
  DeleteUser,
  GetListDepartments,
  GetListGroups,
};
