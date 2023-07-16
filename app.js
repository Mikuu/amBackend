const dns = require('node:dns');
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("morgan");
const indexRouter = require("./routes/index");
const projectRouter = require("./routes/project");
const viewRouter = require("./routes/view");
const nodeRouter = require("./routes/node");
const resultRouter = require("./routes/result");

const { keycloak } = require("./middlewares/keycloak");

const databaseUtils = require("./utils/database-utils");

/**
 * Given:
 *  1. When request access_token with Service Account's secret, the Keycloak server returns access_token with a ISS which
 *  url host is 'localhost',
 *  2. Keycloak-connect validate access_token with provided keycloak config, in which the realmUrl need equal above ISS
 *  that host must be 'localhost', not '127.0.0.1',
 *  3. Keycloak-connect uses http(s).request to fetch realm public key from Keycloak server, the url is from config realmUrl
 *  that is 'localhost',
 *  4. NodeJS starts from v17 resolves DNS with system order, however on my environment always resolve with IPV6, thus
 *  resolve 'localhost' to '::1', not '127.0.0.1' of IPV4,
 *  5. The Keycloak server is launched with Docker, by default only listen on IPV4 address, it needs several efforts to
 *  enable IPV6 for both Keycloak and Docker,
 *
 * Then:
 *  Set this DNS resolve order to 'ipv4first' to make NodeJS resolve DNS through IPV4 first.
 * **/
dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(keycloak.middleware());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use("/", indexRouter);
app.use("/amb", projectRouter);
app.use("/amb", viewRouter);
app.use("/amb", nodeRouter);
app.use("/amb", resultRouter);

databaseUtils.connect();

module.exports = app;
