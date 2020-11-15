const mongoose = require("mongoose");
const {
  db: { dbHost, dbUser, dbPass, dbName },
} = require("./config");

const isDev = process.env.ENV === "development" ? true : false;

const dbURI = `mongodb${
  !isDev ? "+srv" : ""
}://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected To Database !");
});
db.on("error", (err) => {
  console.error(err);
});

db.on("disconnected", () => {
  console.log("\nDatabase Disconnected !");
});
process.on("SIGINT", async () => {
  await db.close();
  process.exit(0);
});
