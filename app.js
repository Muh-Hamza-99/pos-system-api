require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");

const express = require("express");
const app = express();

const userRouter = require("./routes/user-routes");

const globalErrorHandler = require("./middleware/error-handler");

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("Successfully connected to database!"))
    .catch(error => console.log(`Oh no, something went wrong...${error}`));

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`Server is up and running on port ${PORT}...`));