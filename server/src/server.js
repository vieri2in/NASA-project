const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const PORT = process.env.PORT || 8000;
const MOGO_URL =
  "mongodb+srv://vieri21bin:AfGf55Prx4nVANYC@cluster0.ku9bnck.mongodb.net/nasa?retryWrites=true&w=majority";
const server = http.createServer(app);
mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready.");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});
async function startSever() {
  await mongoose.connect(MOGO_URL, {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
  });
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startSever();
