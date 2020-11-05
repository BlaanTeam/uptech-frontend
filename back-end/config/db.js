const mongoose = require("mongoose");
const {
  dbTest: { dbHost, dbUser, dbPass, dbName },
} = require("./config");

// const dbURI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
const dbURI = `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin`;

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
