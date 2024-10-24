var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { config } = require('../config/config')
var md5 = require('md5');


const Encrypt = (string) => {
    return md5((md5(config.encrypt_key)) + (md5(string)));

}

const auth = (req, res, next) => { // kiểm tra có token thì cho chạy tiếp
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.encrypt_key, async (err, user) => {
            if (err) {
                res.status(401).json({ status: 401, success: false, message: "Token verify false", payload: "" });
            }
            else {
                user.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                req.user = user;
                next();
            }
        });
    } else {
        res.status(403).json({ status: 403, success: false, message: "Token not found!" });
    }
};

module.exports = {
    auth,
    Encrypt
}