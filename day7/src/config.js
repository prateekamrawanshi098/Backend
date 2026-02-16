const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to Database");
    })
    .catch((err) => {
        console.log("connetion failed");
        console.log(err);
        
    });
}

module.exports = connectToDb;
