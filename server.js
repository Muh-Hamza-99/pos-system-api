require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", err => {
    console.log(`Uncaught Exception! ${err.name}, ${err.message}.`);
    process.exit(1);
});

const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);
const PORT = process.env.PORT || 6000;

const startServer = async () => {
    try {
        await mongoose.connect(DB);
        app.listen(PORT, () => console.log(`Server is up on port ${PORT}...`));
    } catch (error) { console.log(`Something went wrong...${error}`) };
};

const server = await startServer();

process.on("unhandledRejection", err => {
    console.log(`Unhandled Rejection! ${err.name}, ${err.message}.`);
    server.close(() => process.exit(1));
});