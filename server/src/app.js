const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api");
// const planetRouter = require("./routes/planets/planets.router");
// const launchesRouter = require("./routes/launches/launches.router");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// app.use((req, response, next) => {
//   const start = Date.now();
//   next();
//   const delta = Date.now() - start;
//   console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
// });
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../", "public")));
app.use("/v1", api);
app.get("/*", (req, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
