const express = require("express");
const router = require("./routers/index.js");
const pool = require("./config/ormconfig.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const Fingerprint = require("express-fingerprint");
const TokenService = require("./services/token.js");
const errorMiddleware = require("./middlewares/errorMiddleware.js");

// const errorMiddleware = require('./middlewares/errorMiddleware.js');

const PORT = process.env.PORT || 5002;
const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  }),
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.set("view engine", "ejs");
app.use("", router);

// app.use(errorMiddleware);

async function startApp() {
  try {
    await pool.connect();
    console.log("Successful connection to the database");
  } catch (error) {
    console.log("Eror in connection to the database");
    throw new Error(error);
  }
  try {
    app.listen(PORT, () => {
      console.log("Server started on port - ", PORT);
    });
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
    throw new Error(error);
  }
}

startApp();
