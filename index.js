const express = require("express");
const morgan = require("morgan");
const { path, dirname } = require("path");
const { fileURLToPath } = require("url");
const rfs = require("rotating-file-stream");
const winstonElasticsearch = require("winston-elasticsearch");
const winston = require("winston");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Routes = require("./routes/index.js");

class Server {
  constructor(app) {
    this.config(app);
    new Routes(app);
  }

  config(app) {
    const corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 63072000,
    };

    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (process.env.LOG_LOCAL == "TRUE") {
      if (process.env.LOG_LOCAL_FILE == "TRUE") {
        const __filename = fileURLToPath(require(meta.url));
        const __dirname = dirname(__filename);
        var accessLogStream = rfs.createStream("access.log", {
          interval: "1d", // rotate daily
          path: path.join(__dirname, "../log"),
        });
        app.use(morgan("combined", { stream: accessLogStream }));
      } else {
        app.use(morgan("combined"));
      }
    }
    if (process.env.LOG_ELK == "TRUE") {
      const esTransportOpts = {
        level: "info",
        indexPrefix: "logging-api",
        indexSuffixPattern: "YYYY-MM-DD",
        clientOpts: {
          node: process.env.ES_ADDON_URI,
          maxRetries: 5,
          requestTimeout: 10000,
          sniffOnStart: false,
          auth: {
            username: process.env.ES_ADDON_USER,
            password: process.env.ES_ADDON_PASSWORD,
          },
        },
        source: process.env.LOG_SOURCE || "api",
      };
      const esTransport = new winstonElasticsearch.ElasticsearchTransport(
        esTransportOpts
      );

      const logger = winston.createLogger({
        transports: [
          new winston.transports.Console({
            level: "info",
            json: true,
          }),
          esTransport, //Add es transport
        ],
      });
    }
    app.use("/rooms", require("./controller/rentalroom/index.js"));
    app.use("/user", require("./controller/user/index.js"));
    app.use("/auth", require("./controller/login"));
    app.use("/ew", require("./controller/ew"));
    app.use("/booking", require("./controller/booking"));
    app.use("/service", require("./controller/service"));
    app.use("/customer", require("./controller/customer"));
    app.use("/listroom", require("./controller/listroom"));
    app.use("/rentalfee", require("./controller/rentalfee"));
    app.use("/house", require("./controller/house"));
    app.use("/staff", require("./controller/Staff"));
    app.use("/other", require("./controller/otherfee"));
    app.use("/dashboard", require("./controller/dashboard"));
    app.use("/order", require("./controller/Order"));
    app.use("/home", require("./controller/home"));
  }
}
module.exports = Server;
