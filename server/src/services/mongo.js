const mongoose = require("mongoose");
require("dotenv").config();
const MOGO_URL = process.env.MONGO_URL;
mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready.");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});
async function mongoConnect() {
  await mongoose.connect(MOGO_URL, {});
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = {
  mongoConnect,
  mongoDisconnect,
};
