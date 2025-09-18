const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
require("dotenv").config();

app.use(express.json());
app.use("/api/v1" , require("./src/v1/routes/auth"));

// connect to MongoDB
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

