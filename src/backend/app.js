const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const logger = require("../utils/logger");
const config = require("../utils/config");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = [
  config.URL,
  config.ADMIN_URL,
  config.HOLITECH_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:3002",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

const morganMiddeware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }
);

app.use(morganMiddeware);

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
  });
});

const pathToRoutes = path.join(__dirname, "routes");
fs.readdir(pathToRoutes, (err, files) => {
  if (err) throw new Error(err);

  files.forEach((file) => {
    const Route = require(path.join(pathToRoutes, file));
    if (Route.path && Route.router) app.use(Route.path, Route.router);
  });

  // catch 404 and forward to error handler
  app.use("*", (req, res) => {
    res.status(404).json({
      ok: false,
      message: "Sahifa topilmadi",
    });
  });
});

// error handler
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(500).send("Ichki serverda xatolik yuz berdi.");
});

async function server() {
  try {
    const PORT = config.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(
        `SERVER RUNNING NODE_ENV=${config.NODE_ENV} PORT=${config.PORT}`
      );
    });
  } catch (e) {
    logger.error(e + "");
  }
}

module.exports = server;
