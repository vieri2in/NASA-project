const mongoose = require("mongoose");
const MOGO_URL =
  "mongodb+srv://vieri21bin:AfGf55Prx4nVANYC@cluster0.ku9bnck.mongodb.net/nasa?retryWrites=true&w=majority";
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
