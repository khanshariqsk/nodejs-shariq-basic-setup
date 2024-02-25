const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const app = require("./app");
const { MONGODB_URL } = require("./config");

const PORT = 3000;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("successfully connected to db");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to db");
  }
};

startServer();
