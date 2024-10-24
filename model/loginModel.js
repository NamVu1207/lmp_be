const { db } = require('../config/database');
const {Encrypt} = require('../service/authenticate')


const checkUser = (username, password, userType) => {
    return new Promise(async (resolve, reject) => {
        db('employees').select('*')
            .where({
                "username": username,
                "pass": password,
            })
            .limit(1)
            .then((user) => {
                if (user.length) {
                    delete user[0]['Password'];
                    resolve(user);
                    return;
                } else {
                    reject('Not Found !');
                    return;
                }
            })
    });
}

module.exports = {
    checkUser
}
