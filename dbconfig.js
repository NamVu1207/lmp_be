require("dotenv").config()
import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  options: {
    trustedconnection: true,
  }
};

export const configHIS = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAMEHIS,
  options: {
    trustedconnection: true,
  }
};

