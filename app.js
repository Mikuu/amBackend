const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const projectRouter = require("./routes/project");
const viewRouter = require("./routes/view");
const nodeRouter = require("./routes/node");

const databaseUtils = require("./utils/database-utils");
// const fileUpload = require("express-fileupload");

const app = express();
// app.use(fileUpload({}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/amb", projectRouter);
app.use("/amb", viewRouter);
app.use("/amb", nodeRouter);

databaseUtils.connect();

module.exports = app;
