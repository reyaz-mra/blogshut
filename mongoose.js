const mongoose = require("mongoose");

const connectionString = process.env.DATABASE_URL || "mongodb://localhost:27017/userDB";


async function connectToMongo() {
    console.log("Connecting to database...");
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database");
}
module.exports.connectToMongo = connectToMongo;
