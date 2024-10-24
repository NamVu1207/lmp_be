const express = require("express");
const Server = require("./index");
require("dotenv").config();

const app = express();
new Server(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}.`);
})
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });