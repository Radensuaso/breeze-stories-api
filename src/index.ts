import mongoose from "mongoose";
import app from "./app";
import listEndpoints from "express-list-endpoints";

process.env.TS_NODE_DEV && require("dotenv").config();

if (!process.env.PORT) {
  throw new Error("No Port defined");
}
const PORT = process.env.PORT || 3001;

if (!process.env.MONGO_CONNECTION) {
  throw new Error("No Mongo connection defined.");
}

mongoose.set("debug", true);
mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("🍃Successfully connected to mongo!");
  app.listen(PORT, () => {
    console.table(listEndpoints(app));
    console.log("🛩️ Server is running on port ", PORT);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MONGO ERROR: ", err);
});
