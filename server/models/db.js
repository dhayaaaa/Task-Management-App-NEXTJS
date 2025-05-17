const mongoose = require("mongoose");
require("dotenv").config();

const mongo_url = "mongodb+srv://dhayadhayaaaa:Student%40123@dhayacluster.6fy7fw1.mongodb.net/?retryWrites=true&w=majority&appName=DhayaCluster";

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
