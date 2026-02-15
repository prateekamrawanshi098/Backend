const app = require("./src/App")
const mongoose = require("mongoose")

function connectToDB(){
    mongoose
      .connect(
        "mongodb+srv://prateek:n1uETODyLSAmKrcz@cluster0.gsx4kum.mongodb.net/day6"
      )
      .then(() => {
        console.log("connected to database");
      });
        
}

connectToDB()

app.listen(3000, () => {
    console.log("server started on port 3000");
    
})